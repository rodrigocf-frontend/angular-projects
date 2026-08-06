# Maison

A fashion e-commerce storefront built as a portfolio project, focused on modern Angular + NgRx patterns.

## Overview

Maison lets you browse a product catalog by category, filter and sort listings, open a product's details page to pick a color/size and add it to a cart, and follow the flow through a cart drawer, a full cart page, and a checkout scaffold. Product data is served locally through json-server, with filtering, sorting and pagination handled server-side via query params.

## Tech Stack

- **Angular 22** — standalone components, signals, new control flow (`@if` / `@for` / `@empty`), `input()` / `output()`
- **TypeScript 6** — strict typing
- **NgRx** — Store, Effects, Store DevTools; one feature slice per route (products, product details, cart), each with its own actions/reducer/effects/selectors
- **RxJS** — `switchMap` for cancelable requests, `catchError` for effect-safe error handling
- **Angular HttpClient** — REST integration against json-server's query syntax (`_page`, `_per_page`, `_in`, `_contains`, `_gte`/`_lte`)
- **Angular CDK** — `ScrollingModule` for pagination
- **Reactive Forms** — price range filters (`FormControl`, `debounceTime`, `distinctUntilChanged`) with a custom BRL currency mask directive
- **SCSS** — numeric design tokens converted through a shared `rem()` function, partials forwarded from a single global stylesheet
- **json-server** (v1 beta) — fake REST API for local development
- **Vitest** — unit testing via Angular's `@angular/build:unit-test` builder
- **Prettier** — formatting
- **pnpm** — package management

## Features

- Home page — hero, marquee, categories, highlighted products, promo banner and newsletter sections
- Product listing — category/color/size/price filters, sort order, pagination, loading and empty states
- Product details — image gallery with thumbnail navigation, color/size selection, description/composition/care tabs, star rating, related products, loading skeleton and not-found fallback
- Add to cart from the details page (with the selected color/size) or from a related product card
- Cart drawer — slide-out panel with quantity controls, removal, empty state, and a live subtotal
- Full cart page (`/cart`) mirroring the drawer's data with a tabbed header
- Checkout page scaffold (`/checkout`) — address, contact, payment and order summary sections
- Reusable attribute-selector `Button` (`primary` / `ghost` / `secondary` / `underline`) and a shared quantity stepper used by both the drawer and the cart page
- Environment-based NgRx DevTools (enabled in development, disabled in production)

## Architecture Decisions

### NgRx scoped per feature, not one global store

Each route owns its own slice — `products`, `productDetails` and `cart` — registered via `provideState`/`provideEffects` at the route level (cart is provided at the root config since the drawer is mounted globally). There's no shared "app" reducer; state stays close to the feature that owns it.

### Derived values live in selectors, not duplicated state

Cart total and item count are `createSelector`s computed from `items` (`selectCartTotal`, `selectTotalItems`), not separate state fields updated by their own actions. A derived value stored alongside its source is a state-sync bug waiting to happen; a memoized selector can't drift out of sync because it has nothing to sync.

### Cart lines are keyed by product + color + size

`CartProductItem` equality checks `product.id`, `color.hex` and `size.label` together, so the same product in two variants becomes two independent cart lines instead of merging into one incorrect count.

### Attribute-selector `Button` component

`selector: 'button[primary], button[ghost], button[secondary], button[underline], a[primary]'` enhances the native `<button>`/`<a>` element directly rather than wrapping it in a custom tag — no extra DOM node, native focus/keyboard semantics preserved for free.

### Delimited-string variant fields instead of nested arrays

`Product.sizes` / `Product.colors` are stored as comma-separated `"Label:isAvailable"` / `"Nome:#hex"` strings rather than nested arrays of objects. json-server's `_contains` filter doesn't reliably match against nested array-of-object fields, but does match cleanly against a flat string — the parsing trade-off (`getProductColors` / `getProductsSizes` in `shared/utils/product.ts`) was chosen to keep filtering reliable.

### Shared form styles as a global Sass partial, not per-component

`themes/_forms.scss` holds the checkout form's shared classes (`.form-grid`, `.field`, `.input`, `.select`, `.error-msg`) and is `@forward`ed from `themes/styles.scss`, the single stylesheet registered in `angular.json`. Per-component `styleUrl` styles don't cascade into sibling or child components under Angular's view encapsulation, so classes meant to be reused across the address/contact/payment step components have to live in truly global CSS.

### Cart drawer mounted at the root

`DrawerCartComponent` sits in `AppComponent`, outside the router outlet, and is toggled from anywhere via a `toogleCart` NgRx action (dispatched from the navbar, from the empty-cart CTA, etc.). It can overlay any route without being nested inside that route's component tree.

## Running Locally

**Prerequisites:** Node.js 20+, pnpm

```bash
# Install dependencies
pnpm install

# Start the fake API (port 3000)
pnpm db:start

# Start the Angular app (port 4200)
pnpm start
```

Open `http://localhost:4200` in your browser. The API will be available at `http://localhost:3000`.

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `pnpm start`    | Angular dev server              |
| `pnpm db:start` | json-server locally (port 3000) |
| `pnpm build`    | Production build                |
| `pnpm watch`    | Development build in watch mode |
| `pnpm test`     | Unit tests with Vitest          |

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── product/                # ProductService — listing, filters, single product, related products
│   ├── shared/
│   │   ├── components/
│   │   │   ├── breadcrumb/                 # Dynamic path segments
│   │   │   ├── drawer-cart/                # Global slide-out cart, mounted in AppComponent
│   │   │   ├── footer/
│   │   │   ├── navbar/                     # Swaps to a focused header while on /checkout
│   │   │   ├── quanty-control.component/   # Shared +/- quantity stepper
│   │   │   └── section-header/
│   │   ├── directives/
│   │   │   └── mask.directive.ts       # BRL currency mask for the price filters
│   │   ├── models/
│   │   │   └── product.model.ts
│   │   ├── ui/
│   │   │   └── button/                 # Attribute-selector Button (button[primary], a[primary]...)
│   │   └── utils/
│   │       ├── currency.ts
│   │       ├── product.ts              # getProductColors / getProductsSizes parsers
│   │       └── scroller.ts
│   └── pages/
│       ├── home/
│       │   └── components/             # hero, marquee, categories, highlight-products, banner, newsletter
│       ├── products/
│       │   ├── components/             # sidebar, products-list, pagination, loading/empty states
│       │   └── store/products/         # NgRx: filters, pagination, sort
│       ├── product-details-page/
│       │   ├── components/             # gallery, info, related, skeleton, not-found
│       │   └── store/                  # NgRx: product, related products, isLoading
│       ├── product-cart-page/
│       │   └── store/                  # NgRx: items (product+color+size), drawer open state
│       └── product-checkout-page/
│           └── components/             # address-step, contact-step, payment-step, order-summary
└── themes/
    ├── _tokens.scss                    # Design tokens (colors, type scale, letter-spacing)
    ├── _utils.scss                     # rem() conversion function
    ├── _forms.scss                     # Shared form styles, forwarded globally
    └── styles.scss                     # Global stylesheet, entry point
```

## Author

**Rodrigo Cunha** — Developer
[GitHub](https://github.com/rodrigocf-frontend)
