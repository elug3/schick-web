export interface ProductFacets {
  style?: string;
  family?: string;
  productType?: string;
}

/** Parse structured facets encoded in product tags (e.g. style:Casual). */
export function parseProductTags(tags?: string[]): ProductFacets {
  const facets: ProductFacets = {};

  for (const tag of tags ?? []) {
    const colon = tag.indexOf(":");
    if (colon === -1) continue;

    const key = tag.slice(0, colon).trim().toLowerCase();
    const value = tag.slice(colon + 1).trim();
    if (!value) continue;

    switch (key) {
      case "style":
        facets.style = value;
        break;
      case "family":
      case "gender":
        facets.family = value;
        break;
      case "type":
      case "producttype":
      case "product-type":
        facets.productType = value;
        break;
    }
  }

  return facets;
}

export function mergeProductFacets<T extends ProductFacets>(
  product: T,
  tags?: string[]
): T & ProductFacets {
  const fromTags = parseProductTags(tags);
  return {
    ...product,
    style: product.style ?? fromTags.style,
    family: product.family ?? fromTags.family,
    productType: product.productType ?? fromTags.productType,
  };
}
