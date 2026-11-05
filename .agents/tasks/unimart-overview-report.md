# UniMart — Project Overview Report

> Read-only investigation. Nothing was modified.
> Note on paths: the actual workspace root is `c:\Users\Admin\Desktop\Bless Work\UniMart`. The investigation brief referenced a path without `Admin`; this report cites the real files.

---

## Summary (what your project is)

**UniMart is an early-stage, campus-focused peer-to-peer (C2C) marketplace** where university students and staff list items for sale, negotiate prices with buyers through in-app offers and chat, and transact through orders that take a platform commission and hold money in escrow wallets, with reviews and a dispute-resolution system on top.

Evidence the intent is a **campus P2P marketplace** (not a single-seller store or an auction):
- `backend/database/tables/users.js` defines `role_enum ('student', 'staff', 'admin')` and a unique `school_id` — membership is scoped to a school/university.
- `frontend/src/components/Navbar.jsx` mobile drawer footer says "Campus Marketplace for Students & Staff".
- `backend/database/tables/orders.js` models both sides of a trade: `buyer_id` + `seller_id` + `listing_id` + `offer_id`, with `commission_rate`, `commission_amount`, `seller_payout`, and `payment_method` enum `('cod', 'paystack')`. Paystack + "Cash on Delivery for campus meetups" (`frontend/src/pages/ContactUsPage.jsx` FAQ) point to a Ghana/West-Africa campus context.
- The negotiation + escrow flow is a marketplace pattern, not retail: `listings` → `conversations` → `offers`/`messages` → `orders` → `reviews`/`disputes`/`wallet_transactions`.

**Current state, in one line:** the database schema is fully designed (11 tables), the frontend is a polished marketing + storefront-browsing prototype, but the backend is ~95% unimplemented — only an auth endpoint exists, and even that runs against an in-memory array instead of the database.

---

## Evidence by question

### Q1 — What is UniMart / what domain?

A campus peer-to-peer marketplace. See summary above. Core domain entities (from `backend/database/tables/*.js`): users (students/staff/admin), categories, listings, conversations, messages, offers, orders, reviews, disputes, wallets, wallet_transactions. Design-spec documents live at the repo root as `UNIMART_Database_Schema.docx` and `UNIMART_OrderLifecycle.docx` (binary Office files; not parsed, but their names confirm the schema and an order/dispute lifecycle are the intended design).

### Q2 — Main backend features / endpoints (grouped by domain)

**Only auth is actually wired up.** `backend/app.js` mounts a single router: `app.use("/api/v1/auth", authRoutes)`. Everything else is scaffolding.

Implemented and live:
- **Auth** — `backend/routes/auth.routes.js`: `POST /api/v1/auth/register` → `register`; `POST /api/v1/auth/login` → `login` (`backend/controllers/auth.controller.js`). Login returns a JWT.
- **Auth middleware** — `backend/middleware/auth.js` exports `authenticateToken` (verifies `Authorization: Bearer <jwt>` against `JWT_SECRET`). It exists but is **not applied to any route** today.

Stubbed but empty (0-byte files — no routes, no handlers):
- **Listings** — `backend/routes/listing.routes.js` (0 bytes), `backend/controllers/lisitng.controller.js` (0 bytes; note the typo "lisitng").
- **Categories** — `backend/routes/category.routes.js` (0 bytes), `backend/controllers/category.auth.js` (0 bytes; note the misnaming — it is not a controller file).
- **Orders** — `backend/routes/order.routes.js` (0 bytes), `backend/controllers/order.controller.js` (0 bytes).
- **Conversations/Messages** — `backend/routes/conversation.routes.js` (0 bytes), `backend/controllers/conversation.controller.js` (0 bytes). (Messages have a `messages.js` table but no dedicated route/controller file at all.)
- **Reviews** — `backend/routes/review.routes.js` (0 bytes), `backend/controllers/review.controller.js` (0 bytes).
- **Disputes** — `backend/routes/disputes.routes.js` (0 bytes), `backend/controllers/disputes.controller.js` (0 bytes).

Not even stubbed (no files exist):
- **Offers** — table exists, but there is no `offers.routes.js` or `offers.controller.js`.
- **Wallets / Wallet transactions** — `wallets.js` and `wallet_transactions.js` tables exist, but there is no `wallet.routes.js`, `wallets.controller.js`, etc. No route or controller files for these domains at all.

### Q3 — Tech stack

Backend (`backend/package.json`, `backend/app.js`, `backend/config/db.js`):
- **Runtime/framework:** Node.js + Express 5 (`express ^5.2.1`), ES modules (`"type": "module"`).
- **Database:** PostgreSQL via `pg ^8.22.0` `Pool`, configured from env (`backend/config/db.js` reads `DB_HOST/PORT/NAME/USER/PASSWORD`). DB name `unimart_db`.
- **Auth:** `bcryptjs` (password hashing) + `jsonwebtoken` (JWT, HS256, `JWT_SECRET` from env, 1h expiry). JWT bearer tokens verified by `authenticateToken` middleware.
- **Config:** `dotenv` for env. **Dev:** `nodemon` (`npm run dev` → `nodemon app.js`). **DB init:** `npm run db:init` → `node database/initDatabase.js`.
- **Stack gap:** `cors` is a dependency but is **not imported/used in `app.js`**. The frontend (Vite, default port 5173) and backend (port 3000) are different origins, so CORS will block browser requests once the frontend calls the API.

Frontend (`frontend/package.json`, `frontend/vite.config.js`, `frontend/src/main.jsx`):
- **Framework:** React 19 (`react`/`react-dom ^19.3.1`) + Vite 8 with `@vitejs/plugin-react` (Oxc-based).
- **Routing:** none. Manual client-side routing via `useState` (`activePage`) in `frontend/src/App.jsx` — there is no `react-router`.
- **State:** lifted `useState` in `App.jsx` (cart, wishlist, toast, page). No Redux/Zustand/context store.
- **Data fetching:** none. There is **no API client, no `axios`, no `fetch` calls anywhere** — the frontend is fully disconnected from the backend. All product/category data is hardcoded in the page components.
- **Styling:** plain CSS (`App.css`, `index.css`); no Tailwind/styled-components. Fonts: Plus Jakarta Sans + Inter via Google Fonts in `frontend/index.html`.
- **Tooling:** ESLint (`eslint.config.js`); `npm run dev/build/lint/preview`. (`zod` appears in `node_modules` as a transitive dep, not a direct dependency, and is not used in app code.)

### Q4 — Data model at a glance

11 tables in `backend/database/tables/`, created (and dropped) by `backend/database/initDatabase.js` in dependency order. All PKs are UUID (`gen_random_uuid()`).

- **users** — `id, full_name, username (uniq), email (uniq), school_id (uniq), role enum('student','staff','admin'), password, avatar_url, bio, phone, rating_avg, created_at, updated_at`.
- **categories** — `id, name (uniq), slug (uniq), description, timestamps`.
- **listings** — `id, seller_id→users (RESTRICT), category_id→categories, title, description, price, media_urls JSONB, delivery_type enum('pickup','delivery','both'), status enum('active','sold','paused','removed'), timestamps`.
- **conversations** — `id, listing_id→listings, buyer_id→users, seller_id→users, UNIQUE(listing_id,buyer_id,seller_id), timestamps`.
- **offers** — `id, conversation_id→conversations (CASCADE), listing_id, seller_id, buyer_id, proposed_by→users, amount, status enum('pending','accepted','declined','superseded'), superseded_at, timestamps`.
- **messages** — `id, conversation_id→conversations (CASCADE), sender_id→users, type enum('text','offer'), body, offer_id→offers (nullable), created_at`.
- **orders** — `id, buyer_id, seller_id, listing_id, offer_id, payment_method enum('cod','paystack'), agreed_price, commission_rate, commission_amount, seller_payout, status enum('pending_payment','processing','dispatched','delivered','completed','disputed','refund_flagged','cancelled'), paystack_ref, dispatched_at, delivered_at, completed_at, resolution_outcome enum('buyer_favour','seller_favour','dismissed'), timestamps`.
- **reviews** — `id, order_id→orders (CASCADE), reviewer_id, seller_id, listing_id, rating INT CHECK 1–5, comment, timestamps`.
- **disputes** — `id, order_id→orders (CASCADE), seller_id, buyer_id, description, reason enum('not_received','faulty','not_as_described','services_not_rendered','scam','other'), refund_amount, resolved_by→users (SET NULL), resolution_notes, status enum('open','resolved','dismissed'), timestamps`.
- **wallets** — `id, user_id (uniq)→users, balance DECIMAL(12,2) default 0.00, timestamps`.
- **wallet_transactions** — `id, wallet_id→wallets (CASCADE), amount, type enum('credit','debit','commission'), description, created_at`.

Key relationships / lifecycle:
`users` (1) → (N) `listings` (seller) ← `categories`; a `listing` spawns `conversations` (buyer+seller); a conversation holds `messages` (type `text` or `offer`) and `offers` (negotiation, with `superseded` status); an accepted `offer` becomes an `order` (commission + payout computed, Paystack ref or CoD); an order yields `reviews` and/or `disputes` (with resolution outcome); each user has one `wallet` tracking `wallet_transactions` (credit/debit/commission). This is a classic marketplace escrow + commission + dispute flow.

### Q5 — Frontend state (built vs stubbed)

Built and functional (client-side, hardcoded data):
- **`frontend/src/App.jsx`** — app shell: `Navbar`, `Footer`, mobile bottom nav, slide-over cart drawer, toast notifications, cart + wishlist state, manual page switching (`navigateTo`).
- **Pages** (`frontend/src/pages/`):
  - `HomePage.jsx` — hero, "Shop by Categories" (6), best-selling products carousel, special-offer banner, video modal.
  - `ShopPage.jsx` — full filter/sort engine (category, price slider, brand checkboxes, rating, grid/list view, sort dropdown, active-filter chips, pagination) over 12 hardcoded products.
  - `CategoriesPage.jsx` — 12-category grid with product counts.
  - `AboutUsPage.jsx` — story, mission/vision/values, metrics, team.
  - `ContactUsPage.jsx` — contact channels, message form, FAQ accordion, location.
- **Components** (`frontend/src/components/`): `Navbar.jsx`, `Footer.jsx`, `FeaturesBar.jsx`, `Icons.jsx` (large inline-SVG icon set).
- **Assets:** 42 images in `frontend/public/images`.

Stubbed / missing entirely on the frontend:
- **No backend integration at all** — no API client, no fetch, no auth UI (login/register), no real product data, no persisted cart, no real Paystack checkout ("Proceeding to Paystack secure checkout..." is a toast only — `App.jsx`).
- **No marketplace transaction UI:** seller listing creation/management, product-detail page, in-app messaging/conversations, offers, checkout/orders, wallet, disputes, reviews, user dashboard/profile — none exist yet.
- "Deals" nav item reuses `ShopPage`; "Account" icon just navigates to About (`Navbar.jsx`).

---

## Conclusions and recommendations

The project is a designed-but-mostly-unbuilt campus P2P marketplace. The schema is the most mature artifact; the frontend is a marketing/storefront prototype; the backend has only a placeholder auth endpoint. Recommendations (implement nothing — read-only):

1. **Auth is not actually persisted.** `backend/controllers/auth.controller.js` uses `const users = []` (an in-memory array) instead of the `users` table via `pool`. A server restart loses every account, and nothing is ever saved to Postgres. Wire `register`/`login` to the `users` table with `bcrypt` + `pg`.
2. **Auth schema/field mismatches** will break a real INSERT: the controller reads `phone_number` from `req.body`, but the `users` table column is `phone`; the controller never sets `role`, which is `NOT NULL` with no default. Reconcile field names and set a default role.
3. **Filename typos** in the scaffolding: `lisitng.controller.js` (listing), and `category.auth.js` (should be `category.controller.js`). Fix before wiring these routers so imports resolve.
4. **Missing domains have no route/controller files at all** (offers, wallets, wallet_transactions, messages) — only the tables exist. Add route + controller files for each.
5. **CORS not enabled.** `cors` is installed but `backend/app.js` doesn't use it. Add `app.use(cors(...))` so the Vite frontend (origin :5173) can call the backend (:3000); configure an allowed origin rather than leaving it fully open.
6. **`authenticateToken` is unused.** Apply it to protected routes (listings, orders, wallets, conversations, etc.) once those exist.
7. **Minor bug in `app.js`:** the startup DB check logs `result.row[0]` (singular) — `pg` returns `result.rows`, so this logs `undefined`.
8. **Secrets committed to the repo.** `backend/.env` contains live `JWT_SECRET` and DB credentials in plaintext. Move to a `.env.example` + `.gitignore` and rotate the committed secret. (Reported by key name only; values not echoed here.)
9. **Copy inconsistency.** Frontend marketing reads like a generic US e-commerce store (`AboutUsPage.jsx`: "123 Commerce St., New York", "50+ Countries Served", "50K+ Happy Customers") while the actual product is a Ghana/campus P2P marketplace (`school_id`, student/staff roles, Paystack, "campus meetups", "Ghana Cards"). Align the copy with the real intent.
10. **Frontend has no API/data layer.** When backend endpoints land, add a small fetch/API module and (ideally) `react-router` so the current `useState` page hack doesn't have to carry real routes, product detail, and authenticated flows.
