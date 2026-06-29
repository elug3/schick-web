import { mergeProductFacets } from "./product-tags";
import type { UpstreamProduct } from "./product-upstream.server";

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function scoreRelatedProduct(
  current: UpstreamProduct,
  candidate: UpstreamProduct
): number {
  const currentFacets = mergeProductFacets({}, current.tags);
  const candidateFacets = mergeProductFacets({}, candidate.tags);

  let score = 0;

  if (
    current.brand &&
    candidate.brand &&
    normalize(current.brand) === normalize(candidate.brand)
  ) {
    score += 3;
  }

  if (
    current.capacity &&
    candidate.capacity &&
    normalize(current.capacity) === normalize(candidate.capacity)
  ) {
    score += 2;
  }

  if (
    currentFacets.style &&
    candidateFacets.style &&
    normalize(currentFacets.style) === normalize(candidateFacets.style)
  ) {
    score += 2;
  }

  if (
    currentFacets.family &&
    candidateFacets.family &&
    normalize(currentFacets.family) === normalize(candidateFacets.family)
  ) {
    score += 1;
  }

  return score;
}

export function rankRelatedProducts(
  current: UpstreamProduct,
  candidates: UpstreamProduct[],
  limit = 8
): UpstreamProduct[] {
  const ranked = candidates
    .filter((candidate) => candidate.id !== current.id)
    .map((candidate) => ({
      candidate,
      score: scoreRelatedProduct(current, candidate),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name));

  if (ranked.length >= limit) {
    return ranked.slice(0, limit).map(({ candidate }) => candidate);
  }

  const picked = new Set(ranked.map(({ candidate }) => candidate.id));
  const fallback = candidates
    .filter((candidate) => candidate.id !== current.id && !picked.has(candidate.id))
    .slice(0, limit - ranked.length);

  return [...ranked.map(({ candidate }) => candidate), ...fallback];
}
