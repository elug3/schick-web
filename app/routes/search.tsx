"use client";

import { useState } from "react";
import { mockProducts } from "../data/mockProducts";

const categories = [
  "All",
  "Consultation",
  "Shoes",
  "Outerwear",
  "Bottoms",
  "Bag",
  "Clock",
];

const sizes = ["XS", "S", "M", "L", "XL", "Free"];

export function meta() {
  return [
    { title: "Search | Schick" },
    { name: "description", content: "Search products and collections." },
  ];
}

export default function Search() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-4 py-5">
      <form className="relative">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <SearchIcon />
        <input
          id="product-search"
          name="q"
          type="search"
          placeholder="Search items"
          className="h-12 w-full rounded-lg border border-zinc-200 bg-white pl-11 pr-4 text-[16px] font-medium text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
        />
      </form>

      <section aria-label="Item category" className="space-y-3">
        <h1 className="text-lg font-semibold">Category</h1>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={[
                "h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition",
                index === 0
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
              ].join(" ")}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="detailed-filter-title" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="detailed-filter-title" className="text-lg font-semibold">
            Detailed filter
          </h2>
          <button
            type="button"
            className="h-9 rounded-lg px-3 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Reset
          </button>
        </div>

        <div className="space-y-5 rounded-lg border border-zinc-200 bg-white p-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-zinc-950">
              Price range
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Min</span>
                <input
                  name="minPrice"
                  type="number"
                  inputMode="numeric"
                  placeholder="$0"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-medium outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Max</span>
                <input
                  name="maxPrice"
                  type="number"
                  inputMode="numeric"
                  placeholder="$500"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-medium outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-zinc-950">Size</legend>
            <div className="grid grid-cols-6 gap-2">
              {sizes.map((size) => (
                <label
                  key={size}
                  className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 has-checked:border-zinc-950 has-checked:bg-zinc-950 has-checked:text-white"
                >
                  <input
                    type="checkbox"
                    name="size"
                    value={size}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-zinc-950">
              Condition
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {["New", "Like new", "Used"].map((condition) => (
                <label
                  key={condition}
                  className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-2 text-center text-sm font-semibold text-zinc-700 has-checked:border-zinc-950 has-checked:bg-zinc-950 has-checked:text-white"
                >
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    className="sr-only"
                  />
                  {condition}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-sm font-semibold text-zinc-950">Sort</span>
              <select
                name="sort"
                className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
                defaultValue="recommended"
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low</option>
                <option value="price-high">Price: high</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-semibold text-zinc-950">Stock</span>
              <select
                name="stock"
                className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
                defaultValue="available"
              >
                <option value="available">Available</option>
                <option value="all">All items</option>
                <option value="preorder">Pre-order</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Apply filters
          </button>
        </div>
      </section>

      <section aria-label="Products" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition ${
                viewMode === "grid"
                  ? "bg-white shadow text-zinc-950"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <GridIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition ${
                viewMode === "list"
                  ? "bg-white shadow text-zinc-950"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
              aria-label="List view"
              title="List view"
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-950 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-950">
                      ${product.price}
                    </span>
                    {product.rating && (
                      <span className="text-xs font-medium text-zinc-600">
                        ★ {product.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{product.category}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden hover:shadow-lg transition flex gap-4 p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-950">
                        ${product.price}
                      </span>
                      {product.rating && (
                        <span className="text-xs font-medium text-zinc-600">
                          ★ {product.rating}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 5h18m-18 6h18m-18 6h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m20 20-4.35-4.35M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
