# Maison

A fashion e-commerce storefront built as a portfolio project, focused on modern Angular + NgRx patterns.

## Overview

Maison lets you browse a product catalog by category, filter and sort listings, open a product's details page to pick a color/size and add it to a cart, and follow the flow through a cart drawer, a full cart page, and a multi-step checkout (address, contact, payment, confirmation). Product data is served locally through json-server, with filtering, sorting and pagination handled server-side via query params.

## Tech Stack

- **Angular 22** — standalone components, signals, new control flow (`@if` / `@for` / `@empty`), `input()` / `output()`
- **TypeScript 6** — strict typing
- **NgRx** — Store, Effects, Store DevTools; one feature slice per route (products, product details, cart), each with its own actions/reducer/effects/selectors
- **RxJS** — `switchMap` for cancelable requests, `catchError` for effect-safe error handling
- **Angular HttpClient** — REST integration against json-server's query syntax (`_page`, `_per_page`, `_in`, `_contains`, `_gte`/`_lte`)
- **Angular CDK** — `ScrollingModule` for pagination, `CdkStepper` subclassed to drive the checkout flow
- **Reactive Forms** — price range filters (`FormControl`, `debounceTime`, `distinctUntilChanged`) and the full checkout form (address/contact/payment), each with validators and a matching input mask directive (currency, phone, CEP, card number, card expiry)
- **SCSS** — numeric design tokens converted through a shared `rem()` function, partials forwarded from a single global stylesheet
- **json-server** (v1 beta) — fake REST API for local development
- **Vitest** — unit testing via Angular's `@angular/build:unit-test` builder, `@vitest/coverage-v8` for coverage, `@ngrx/store/testing` + `@ngrx/effects/testing` for store/effects tests
- **Prettier** — formatting
- **pnpm** — package management

## Features

- Home page — hero, marquee, categories, featured products fetched from the API, promo banner and newsletter sections
- Product listing — category/color/size/price filters, sort order (including "Novidades"/newest and "Sale"), pagination, loading, empty and error (with retry) states
- Product details — image gallery with thumbnail navigation, color/size selection, description/composition/care tabs, star rating, related products, loading skeleton and not-found fallback
- Add to cart from the details page (with the selected color/size) or from a related product card
- Cart drawer — slide-out panel with quantity controls, removal, empty state, and a live subtotal
- Full cart page (`/cart`) mirroring the drawer's data with a tabbed header
- Checkout flow (`/cart/checkout`) — a CDK-`Stepper`-driven wizard through address, contact, payment and order confirmation, each step gated behind its form's validity (invalid submits mark all fields touched and surface inline error messages instead of advancing)
- Checkout input masks — BRL currency, phone, CEP, card number and card expiry, each written as a standalone `NgControl` directive
- Checkout progress (address + contact steps) persisted to `localStorage` and restored on reload; cleared once the order is placed
- Route guard redirects `/cart/checkout` back to the catalog if the cart is empty
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

`DrawerCartComponent` sits in `AppComponent`, outside the router outlet, and is toggled from anywhere via a `toggleCart` NgRx action (dispatched from the navbar, from the empty-cart CTA, etc.). It can overlay any route without being nested inside that route's component tree.

### Checkout stepper owns validity gating, forms stay with the page

`ProductCheckoutPageComponent` owns all three `FormGroup`s and passes each one down as an `input()` to both its step component and to `CheckoutStepperComponent` (a thin subclass of Angular CDK's `CdkStepper`). Advancing a step calls `selectStepByIndex`, which checks the relevant form's `.valid` before moving on and calls `.markAllAsTouched()` otherwise — so invalid fields surface their error state immediately instead of failing silently.

### Input masks as standalone `NgControl` directives

Each masked field (currency, phone, CEP, card number, card expiry) is its own directive attached via `NgControl` + `@HostListener('input')`, formatting the raw value and writing it back with `emitEvent: false` to avoid feedback loops, while preserving cursor position. Kept as separate single-purpose directives rather than one configurable one, since each format has different digit-grouping and truncation rules.

### Effects catch errors inside the inner pipe, never around `ofType`

Every NgRx effect wraps its `catchError` around the request's own inner `switchMap`, not around the outer `action$.pipe(ofType(...))`. An effect is a long-lived stream: letting an inner request's error propagate up to the outer pipe would terminate the whole effect after the first failure, silently killing it for every future dispatch of that action.

### Lenis instantiated lazily, not at module load

`shared/utils/scroller.ts` creates its single `Lenis` instance the first time `scrollBehaviorTo`/`scrollToTop` is actually called, memoized after that, rather than eagerly when the module is imported. Constructing it at import time meant every file that merely imported the module — directly or transitively through a component — paid for a real `Lenis` instance (and its `requestAnimationFrame` loop) whether or not a scroll ever happened, which is both wasteful at runtime and made the module non-deterministic to import under test.

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

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `pnpm start`         | Angular dev server                |
| `pnpm db:start`      | json-server locally (port 3000)   |
| `pnpm build`         | Production build                  |
| `pnpm watch`         | Development build in watch mode   |
| `pnpm test`          | Unit tests with Vitest            |
| `pnpm test:coverage` | Unit tests with a coverage report |

## Testing

470 unit tests across all 59 components, directives, services, guards, utils and NgRx store slices (actions/reducers/selectors/effects), run with Vitest through Angular's `@angular/build:unit-test` builder.

```bash
pnpm test              # run once
pnpm test -- --watch   # watch mode
pnpm test:coverage     # run with a coverage report (text + html + lcov, written to coverage/)
```

Coverage sits at ~99% statements / ~96% branches / ~97% functions / ~99% lines project-wide. `angular.json`'s `test` target enforces an 80% floor on all four metrics (`coverageThresholds`) — `pnpm test:coverage` exits non-zero if a change drops below it. Config-only files with no real logic (`app.config.ts`, `app.routes.ts`, `main.ts`, `environments/`, model type files, test fixtures under `mocks/`) are excluded from the report via `coverageExclude` rather than padding the numbers with untestable boilerplate.

Two support files, wired in via the builder's `setupFiles`/`providersFile` options, keep the test environment consistent with the real app:

- `src/test-setup.ts` — registers `pt-BR` locale data (so `CurrencyPipe` formats the same way under test as in the browser) and polyfills `window.matchMedia`/`ResizeObserver`, which jsdom doesn't implement but Lenis's constructor touches.
- `src/test-providers.ts` — provides `LOCALE_ID: 'pt-BR'` globally for every spec, mirroring `app.config.ts`.

The `test` target also runs with `isolate: true` (Vitest's default for this builder is `false`, shared modules across all spec files in a run). Isolation was turned on deliberately: `scroller.ts` memoizes a single lazily-created `Lenis` instance at module scope, and with a shared module registry, whichever spec file happened to construct it first would "leak" that instance into every other file's assertions, making `vi.mock('lenis', ...)`-based tests order-dependent and flaky.

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
│   │   │   ├── navbar/                     # Swaps to a focused header while on /cart/checkout
│   │   │   ├── quanty-control.component/   # Shared +/- quantity stepper
│   │   │   └── section-header/
│   │   ├── directives/                 # Input masks, one NgControl directive per format
│   │   │   ├── currency-mask.directive.ts
│   │   │   ├── phone-mask.directive.ts
│   │   │   ├── cep-mask.directive.ts
│   │   │   ├── card-number-mask.directive.ts
│   │   │   └── card-expiry-mask.directive.ts
│   │   ├── models/
│   │   │   └── product.model.ts
│   │   ├── ui/
│   │   │   └── button/                 # Attribute-selector Button (button[primary], a[primary]...)
│   │   └── utils/
│   │       ├── currency.ts
│   │       ├── filters.ts              # Route query-param <-> filter state helpers
│   │       ├── product.ts              # getProductColors / getProductsSizes parsers
│   │       └── scroller.ts
│   └── pages/
│       ├── home/
│       │   └── components/             # hero, marquee, categories, highlight-products, banner, newsletter
│       ├── products/
│       │   ├── components/             # sidebar, products-list, pagination, loading/empty/error states
│       │   └── store/products/         # NgRx: filters, pagination, sort, loading/error flags
│       ├── product-details-page/
│       │   ├── components/             # gallery, info, related, skeleton, not-found
│       │   └── store/                  # NgRx: product, related products, isLoading
│       ├── product-cart-page/
│       │   └── store/                  # NgRx: items (product+color+size), drawer open state
│       └── product-checkout-page/
│           ├── product-checkout-page.guard.ts  # Redirects /cart/checkout away when the cart is empty
│           └── components/             # checkout-stepper, address/contact/payment-step, order-summary, order-confirmation
├── mocks/
│   └── models/                         # Shared Product fixtures reused across specs (product.mock.ts, products.mock.ts)
├── themes/
│   ├── _tokens.scss                    # Design tokens (colors, type scale, letter-spacing)
│   ├── _utils.scss                     # rem() conversion function
│   ├── _forms.scss                     # Shared form styles, forwarded globally
│   └── styles.scss                     # Global stylesheet, entry point
├── test-setup.ts                       # Global Vitest setup: pt-BR locale data, matchMedia/ResizeObserver polyfills
└── test-providers.ts                   # Global Vitest DI providers (LOCALE_ID), mirrors app.config.ts
```

Every component, directive, service, guard and store file has a co-located `<name>.spec.ts`.

## Author

**Rodrigo Cunha** — Developer
[GitHub](https://github.com/rodrigocf-frontend)
