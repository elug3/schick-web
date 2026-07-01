#!/usr/bin/env bash
set -euo pipefail

export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-us-east-1}"
CLUSTER="production"
VPC_ID="vpc-0e143b53ca2a4714c"
PUBLIC_SUBNETS='subnet-02c1003124987322c subnet-0d757c4cf8d71963b'
PRIVATE_SUBNETS='subnet-01fd0882721f10499 subnet-006b8428713711816'
ECS_SG="sg-06581371272cab230"
ACCOUNT_ID="845061289093"
ALB_CERT_ARN="arn:aws:acm:us-east-1:845061289093:certificate/a5e612a6-8bec-4d02-8f98-cc8484aa2fc1"

log() { echo "[$(date +%H:%M:%S)] $*" >&2; }

# Copy multi-arch ECR images (requires crane: go-containerregistry)
copy_ecr_with_crane() {
  local src="$1" dst="$2" registry="${3:-845061289093.dkr.ecr.us-east-1.amazonaws.com}"
  if ! command -v crane >/dev/null; then
    log "WARN: crane not installed; skipping $src -> $dst"
    return 1
  fi
  aws ecr get-login-password | crane auth login "$registry" -u AWS --password-stdin >/dev/null
  crane copy "$registry/$src:latest" "$registry/$dst:latest"
}

replace_schick() {
  python3 -c '
import json, sys, re
data = sys.stdin.read()
for old, new in [("SCHICK", "DUPLI1"), ("Schick", "Dupli1"), ("schick", "dupli1")]:
    data = data.replace(old, new)
print(data, end="")
'
}

ensure_secret() {
  local src="$1" dst="$2"
  if aws secretsmanager describe-secret --secret-id "$dst" >/dev/null 2>&1; then
    log "Secret exists: $dst"
    return
  fi
  local value
  value=$(aws secretsmanager get-secret-value --secret-id "$src" --query SecretString --output text)
  aws secretsmanager create-secret --name "$dst" --secret-string "$value" >/dev/null
  log "Created secret: $dst"
}

ensure_ecr_repo() {
  local repo="$1"
  if aws ecr describe-repositories --repository-names "$repo" >/dev/null 2>&1; then
    log "ECR repo exists: $repo"
    return
  fi
  aws ecr create-repository --repository-name "$repo" >/dev/null
  log "Created ECR repo: $repo"
}

copy_ecr_image() {
  local src_repo="$1" dst_repo="$2" tag="$3"
  local manifest
  if ! manifest=$(aws ecr batch-get-image \
    --repository-name "$src_repo" \
    --image-ids "imageTag=${tag}" \
    --query 'images[0].imageManifest' \
    --output text 2>/dev/null); then
    log "WARN: no tag ${tag} in ${src_repo}, skipping copy"
    return
  fi
  if [[ -z "$manifest" || "$manifest" == "None" ]]; then
    log "WARN: empty manifest for ${src_repo}:${tag}"
    return
  fi
  aws ecr put-image --repository-name "$dst_repo" --image-tag "$tag" --image-manifest "$manifest" >/dev/null 2>&1 \
    || log "Image ${dst_repo}:${tag} already present or copied"
  log "Copied ${src_repo}:${tag} -> ${dst_repo}:${tag}"
}

copy_ecr_digest_image() {
  local src_repo="$1" dst_repo="$2" digest="$3"
  local manifest
  manifest=$(aws ecr batch-get-image \
    --repository-name "$src_repo" \
    --image-ids "imageDigest=${digest}" \
    --query 'images[0].imageManifest' \
    --output text)
  aws ecr put-image --repository-name "$dst_repo" --image-tag "$digest" --image-manifest "$manifest" >/dev/null 2>&1 \
    || true
  aws ecr put-image --repository-name "$dst_repo" --image-tag latest --image-manifest "$manifest" >/dev/null 2>&1 \
    || true
  log "Copied digest image ${src_repo}@${digest} -> ${dst_repo}:latest"
}

ensure_log_group() {
  local group="$1"
  if aws logs describe-log-groups --log-group-name-prefix "$group" --query "logGroups[?logGroupName=='${group}'].logGroupName" --output text | grep -q "$group"; then
    log "Log group exists: $group"
    return
  fi
  aws logs create-log-group --log-group-name "$group" >/dev/null
  log "Created log group: $group"
}

register_task_def() {
  local src_family="$1" dst_family="$2"
  if aws ecs describe-task-definition --task-definition "$dst_family" >/dev/null 2>&1; then
    log "Task definition family exists: $dst_family"
    return
  fi
  aws ecs describe-task-definition --task-definition "$src_family" --query taskDefinition --output json \
    | replace_schick \
    | python3 -c "
import json, sys
td = json.load(sys.stdin)
td['family'] = sys.argv[1]
for k in ['taskDefinitionArn','revision','status','requiresAttributes','compatibilities','registeredAt','registeredBy']:
    td.pop(k, None)
print(json.dumps(td))
" "$dst_family" \
    | aws ecs register-task-definition --cli-input-json file:///dev/stdin >/dev/null
  log "Registered task definition: $dst_family"
}

register_renamed_task_def() {
  local src_family="$1" dst_family="$2"
  if aws ecs describe-task-definition --task-definition "$dst_family" >/dev/null 2>&1; then
    log "Task definition family exists: $dst_family"
    return
  fi
  aws ecs describe-task-definition --task-definition "$src_family" --query taskDefinition --output json \
    | replace_schick \
    | python3 -c "
import json, sys
td = json.load(sys.stdin)
td['family'] = sys.argv[1]
for k in ['taskDefinitionArn','revision','status','requiresAttributes','compatibilities','registeredAt','registeredBy']:
    td.pop(k, None)
print(json.dumps(td))
" "$dst_family" \
    | aws ecs register-task-definition --cli-input-json file:///dev/stdin >/dev/null
  log "Registered task definition: $dst_family (from $src_family)"
}

ensure_private_zone() {
  local zone_name="$1"
  local existing
  existing=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${zone_name}.'].Id" --output text | head -1 | sed 's|/hostedzone/||')
  if [[ -n "$existing" ]]; then
    echo "$existing"
    log "Hosted zone exists: ${zone_name} ($existing)"
    return
  fi
  local zid
  zid=$(aws route53 create-hosted-zone \
    --name "$zone_name" \
    --vpc "VPCRegion=${AWS_DEFAULT_REGION},VPCId=${VPC_ID}" \
    --caller-reference "dupli1-$(date +%s)-${zone_name}" \
    --hosted-zone-config Comment="Dupli1 private zone",PrivateZone=true \
    --query 'HostedZone.Id' --output text | sed 's|/hostedzone/||')
  log "Created hosted zone: ${zone_name} ($zid)"
  echo "$zid"
}

ensure_namespace() {
  local name="$1"
  local existing
  existing=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='${name}'].Id" --output text | head -1)
  if [[ -n "$existing" ]]; then
    echo "$existing"
    log "Cloud Map namespace exists: $name ($existing)"
    return
  fi
  local nsid
  nsid=$(aws servicediscovery create-private-dns-namespace \
    --name "$name" \
    --vpc "$VPC_ID" \
    --description "Dupli1 private DNS namespace" \
    --query 'OperationId' --output text)
  for _ in $(seq 1 30); do
    local status
    status=$(aws servicediscovery get-operation --operation-id "$nsid" --query 'Operation.Status' --output text 2>/dev/null || echo PENDING)
    if [[ "$status" == "SUCCESS" ]]; then
      break
    fi
    sleep 2
  done
  existing=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='${name}'].Id" --output text | head -1)
  log "Created Cloud Map namespace: $name ($existing)"
  echo "$existing"
}

ensure_sd_service() {
  local ns_id="$1" name="$2"
  local existing
  existing=$(aws servicediscovery list-services \
    --filters Name=NAMESPACE_ID,Values="$ns_id",Condition=EQ \
    --query "Services[?Name=='${name}'].Arn" --output text | head -1)
  if [[ -n "$existing" ]]; then
    echo "$existing"
    log "Cloud Map service exists: $name"
    return
  fi
  local arn
  arn=$(aws servicediscovery create-service \
    --name "$name" \
    --namespace-id "$ns_id" \
    --dns-config "NamespaceId=${ns_id},DnsRecords=[{Type=A,TTL=10}]" \
    --health-check-custom-config FailureThreshold=1 \
    --query 'Service.Arn' --output text)
  log "Created Cloud Map service: $name"
  echo "$arn"
}

ensure_target_group() {
  local name="$1"
  local existing
  existing=$(aws elbv2 describe-target-groups --names "$name" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || true)
  if [[ -n "$existing" && "$existing" != "None" ]]; then
    echo "$existing"
    log "Target group exists: $name"
    return
  fi
  local arn
  arn=$(aws elbv2 create-target-group \
    --name "$name" \
    --protocol HTTP \
    --port 3000 \
    --vpc-id "$VPC_ID" \
    --target-type ip \
    --health-check-path / \
    --query 'TargetGroups[0].TargetGroupArn' --output text)
  log "Created target group: $name"
  echo "$arn"
}

create_ecs_service_if_missing() {
  local name="$1"
  local task_family="$2"
  local subnets="$3"
  local public_ip="$4"
  local tg_arn="${5:-}"
  local container_name="${6:-}"
  local container_port="${7:-}"
  local sd_arn="${8:-}"

  if aws ecs describe-services --cluster "$CLUSTER" --services "$name" \
    --query 'services[?status==`ACTIVE`].serviceName' --output text 2>/dev/null | grep -q "$name"; then
    log "ECS service exists: $name"
    return
  fi

  local args=(
    aws ecs create-service
    --cluster "$CLUSTER"
    --service-name "$name"
    --task-definition "$task_family"
    --desired-count 1
    --launch-type FARGATE
    --network-configuration "awsvpcConfiguration={subnets=[${subnets// /,}],securityGroups=[$ECS_SG],assignPublicIp=$public_ip}"
    --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"
  )

  if [[ -n "$tg_arn" ]]; then
    args+=(--load-balancers "targetGroupArn=$tg_arn,containerName=$container_name,containerPort=$container_port")
  fi
  if [[ -n "$sd_arn" ]]; then
    args+=(--service-registries "registryArn=$sd_arn")
  fi

  "${args[@]}" >/dev/null
  log "Created ECS service: $name"
}

log "=== Phase 1: Secrets, ECR, Log Groups ==="
for secret in database auth-db-url product-db-url vpn/client-config; do
  ensure_secret "schick/production/${secret}" "dupli1/production/${secret}"
done

for pair in "schick-auth:dupli1-auth" "schick-product:dupli1-product" "schick-order:dupli1-order" "schick-proxy:dupli1-proxy" "schick-notification:dupli1-notification" "schick-inventory:dupli1-inventory"; do
  src="${pair%%:*}"; dst="${pair##*:}"
  ensure_ecr_repo "$dst"
  copy_ecr_image "$src" "$dst" latest || true
done

copy_ecr_digest_image schick-order dupli1-order sha256:5e56bbe17a961f0697aad33d0b1932d10b5300cf8bf4d00611d7181113dfe1ea || true
copy_ecr_digest_image schick-notification dupli1-notification sha256:c39c5101b843a558f7ec90ded20ff200d6a80fd2e6f3eb840e5eaae34d754339 || true
copy_ecr_digest_image schick-notification dupli1-notification sha256:9eaed229d538ef3bee23f2af074e633da6148771e54197b0aae8e70af45cd259 || true

ensure_log_group "/ecs/dupli1-web-task"
ensure_log_group "/ecs/dupli1-manage-web-task"

log "=== Phase 2: DNS and Cloud Map ==="
DUPLI1_LOCAL_NS=$(ensure_namespace "dupli1.local")
DUPLI1_INTERNAL_NS=$(ensure_namespace "dupli1.internal")

SD_AUTH=$(ensure_sd_service "$DUPLI1_LOCAL_NS" auth)
SD_PRODUCT=$(ensure_sd_service "$DUPLI1_LOCAL_NS" product)
SD_PROXY=$(ensure_sd_service "$DUPLI1_LOCAL_NS" proxy)
SD_INTERNAL=$(ensure_sd_service "$DUPLI1_LOCAL_NS" internal)
SD_POSTGRES=$(ensure_sd_service "$DUPLI1_LOCAL_NS" postgres)
SD_MANAGE_LOCAL=$(ensure_sd_service "$DUPLI1_LOCAL_NS" manage)
SD_MANAGE_INTERNAL=$(ensure_sd_service "$DUPLI1_INTERNAL_NS" manage)

log "=== Phase 3: Task Definitions ==="
register_renamed_task_def schick-web-task dupli1-web-task
register_renamed_task_def schick-manage-web-task dupli1-manage-web-task
register_renamed_task_def schick-db-init dupli1-db-init
register_renamed_task_def schick-db-migrate dupli1-db-migrate

for family in auth-task product-task order-task proxy-task inventory-task notification-task; do
  if ! aws ecs describe-task-definition --task-definition "$family" >/dev/null 2>&1; then
    continue
  fi
  # Re-register same family with updated schick references
  aws ecs describe-task-definition --task-definition "$family" --query taskDefinition --output json \
    | replace_schick \
    | python3 -c "
import json, sys
td = json.load(sys.stdin)
family = td['family']
for k in ['taskDefinitionArn','revision','status','requiresAttributes','compatibilities','registeredAt','registeredBy']:
    td.pop(k, None)
print(json.dumps(td))
" \
    | aws ecs register-task-definition --cli-input-json file:///dev/stdin >/dev/null
  log "Registered updated revision for: $family"
done

log "=== Phase 4: Target Group and ECS Services ==="
DUPLI1_TG=$(ensure_target_group "dupli1-web-3000-tg")

create_ecs_service_if_missing dupli1-web dupli1-web-task "$PUBLIC_SUBNETS" ENABLED "$DUPLI1_TG" web-container 3000
create_ecs_service_if_missing dupli1-auth auth-task "$PRIVATE_SUBNETS" DISABLED "" "" "" "$SD_AUTH"
create_ecs_service_if_missing dupli1-product product-task "$PRIVATE_SUBNETS" DISABLED "" "" "" "$SD_PRODUCT"
create_ecs_service_if_missing dupli1-proxy proxy-task "$PRIVATE_SUBNETS" DISABLED "" "" "" "$SD_PROXY"
create_ecs_service_if_missing dupli1-order order-task "$PRIVATE_SUBNETS" DISABLED
create_ecs_service_if_missing dupli1-inventory inventory-task "$PRIVATE_SUBNETS" DISABLED
create_ecs_service_if_missing dupli1-notification notification-task "$PRIVATE_SUBNETS" DISABLED
create_ecs_service_if_missing dupli1-manage-web dupli1-manage-web-task "$PRIVATE_SUBNETS" DISABLED "" "" "" "$SD_MANAGE_INTERNAL"

log "Waiting for dupli1-web service to become stable..."
aws ecs wait services-stable --cluster "$CLUSTER" --services dupli1-web

log "=== Phase 5: Cut over ALB to dupli1-web target group ==="
OLD_ALB_ARN=$(aws elbv2 describe-load-balancers --names schick-prod-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text)
HTTPS_LISTENER=$(aws elbv2 describe-listeners --load-balancer-arn "$OLD_ALB_ARN" --query 'Listeners[?Port==`443`].ListenerArn' --output text)
aws elbv2 modify-listener \
  --listener-arn "$HTTPS_LISTENER" \
  --default-actions "Type=forward,TargetGroupArn=$DUPLI1_TG" >/dev/null
log "Updated HTTPS listener to forward to $DUPLI1_TG"

DUPLI1_ZONE=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='dupli1.com.'].Id" --output text | sed 's|/hostedzone/||')
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arn "$OLD_ALB_ARN" --query 'LoadBalancers[0].DNSName' --output text)
ALB_ZONE_ID=$(aws elbv2 describe-load-balancers --load-balancer-arn "$OLD_ALB_ARN" --query 'LoadBalancers[0].CanonicalHostedZoneId' --output text)
aws route53 change-resource-record-sets --hosted-zone-id "$DUPLI1_ZONE" --change-batch "{
  \"Changes\": [{
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"dupli1.com\",
      \"Type\": \"A\",
      \"AliasTarget\": {
        \"HostedZoneId\": \"$ALB_ZONE_ID\",
        \"DNSName\": \"$ALB_DNS\",
        \"EvaluateTargetHealth\": false
      }
    }
  }, {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"www.dupli1.com\",
      \"Type\": \"A\",
      \"AliasTarget\": {
        \"HostedZoneId\": \"$ALB_ZONE_ID\",
        \"DNSName\": \"$ALB_DNS\",
        \"EvaluateTargetHealth\": false
      }
    }
  }]
}" >/dev/null
log "Updated dupli1.com and www.dupli1.com alias records"

log "=== Phase 6: Scale down legacy schick ECS services ==="
for svc in schick-web schick-auth schick-product schick-order schick-proxy schick-inventory schick-notification schick-manage-web; do
  if aws ecs describe-services --cluster "$CLUSTER" --services "$svc" --query 'services[0].status' --output text 2>/dev/null | grep -q ACTIVE; then
    aws ecs update-service --cluster "$CLUSTER" --service "$svc" --desired-count 0 >/dev/null
    log "Scaled down: $svc"
  fi
done

sleep 30

for svc in schick-web schick-auth schick-product schick-order schick-proxy schick-inventory schick-notification schick-manage-web; do
  if aws ecs describe-services --cluster "$CLUSTER" --services "$svc" --query 'services[0].status' --output text 2>/dev/null | grep -q ACTIVE; then
    aws ecs delete-service --cluster "$CLUSTER" --service "$svc" --force >/dev/null
    log "Deleted ECS service: $svc"
  fi
done

log "=== Phase 7: Rename RDS instance ==="
if aws rds describe-db-instances --db-instance-identifier schick-production >/dev/null 2>&1; then
  aws rds modify-db-instance \
    --db-instance-identifier schick-production \
    --new-db-instance-identifier dupli1-production \
    --apply-immediately >/dev/null
  log "Renamed RDS instance schick-production -> dupli1-production"
fi

log "=== Migration complete ==="
