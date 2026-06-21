# Schick Web

Schick Web is a React Router application for a specialty fashion and accessories marketplace. The project is structured as a server-rendered React app with Tailwind CSS, Docker support, and production build scripts.

## Compliance Notice

This project must only be used for lawful commerce. Product listings, images, descriptions, metadata, and marketing copy must not advertise, sell, or imply the sale of counterfeit goods, unauthorized replicas, or products that infringe third-party trademarks, copyrights, trade dress, or other intellectual property rights.

Use brand names, logos, protected designs, and luxury-house references only when the business has clear authorization or when the use is legally reviewed and permitted. Marketplace content should describe authentic, licensed, original, or legally sourced products.

## Product Scope

The marketplace can support:

- Apparel categories such as tops, outerwear, pants, dresses, and seasonal collections.
- Accessory categories such as bags, wallets, jewelry, eyewear, belts, scarves, and footwear.
- Curated collections, editorial merchandising, promotions, and product-detail pages.
- Customer-facing shopping flows such as browsing, filtering, cart, checkout, account, and order-history experiences.

The marketplace should not support:

- Counterfeit, imitation, or unauthorized replica products.
- Listings that copy protected luxury-brand names, marks, logos, patterns, silhouettes, or trade dress without authorization.
- Claims that products are equivalent to, inspired by, copied from, or substitutes for protected luxury-brand designs where that claim creates infringement or consumer confusion.

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS
- Docker

## Project Structure

```text
app/
  root.tsx              Root document layout and error boundary
  routes.ts            Route registration
  routes/home.tsx      Home route
  app.css              Global styles and Tailwind import
public/
  favicon.ico          Public browser icon
Dockerfile             Multi-stage production Docker build
package.json           Scripts and dependencies
react-router.config.ts React Router configuration
vite.config.ts         Vite configuration
```

## Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

The browser talks only to same-origin `/api/*` routes. React Router server
routes act as a BFF and forward requests to the internal API gateway configured
with:

```bash
SCHICK_API_BASE_URL=http://localhost:8080
```

If auth and product services are deployed at separate origins, override the
shared gateway with `SCHICK_AUTH_API_BASE_URL` and
`SCHICK_PRODUCT_API_BASE_URL`.

Authenticated browser sessions use an opaque `HttpOnly` session cookie. Access
and refresh tokens are cached server-side by the BFF; access tokens are reused
for at most five minutes and refreshed with the cached refresh token pair. The
BFF includes `audience: "web"` in token requests for the backend contract, but
the current Go auth service must also support/enforce that claim and configure
its JWT expiry if the token `exp` itself must be exactly five minutes.

## Quality Checks

Run TypeScript and React Router type generation:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Docker

Build the image:

```bash
docker build -t schick-web .
```

Run the container:

```bash
docker run -p 3000:3000 schick-web
```

The production server is then available at:

```text
http://localhost:3000
```

## Content Guidelines

**MUST USE Korean product names.** Product titles shown in the catalog, search results, cart, and checkout must use the Korean product name (for example, `루이비통 익스프레스 MM`), not English-only alternatives.

Before adding marketplace content, verify that each product has:

- Lawful sourcing and sale authorization.
- Original or licensed imagery.
- Accurate product names and descriptions in Korean.
- No misleading affiliation with third-party luxury brands.
- No unauthorized logos, monograms, protected patterns, or brand identifiers.
- Clear pricing, shipping, returns, and customer-service information.

## Deployment Notes

The application builds into:

```text
build/
  client/    Static assets
  server/    Server-rendered React Router app
```

Deploy the built output with the production dependencies from `package.json`, or use the included Dockerfile on platforms that support Node containers.
