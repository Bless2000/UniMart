# Review — fix/auth-cors-currency

Base: `62d9eff` (master) → Head: `79e99e0` (fix/auth-cors-currency). Single commit.
Reviewed from the full diff plus coder-recorded verification in the commit message. Suites not re-run per instructions.

## Evidence against the 7 task items

1. **Auth persisted to DB** — `backend/controllers/auth.controller.js` no longer uses `const users = []`. It imports `pool` from `../config/db.js` (line 3); `register` runs `pool.query("SELECT 1 FROM users WHERE username = $1 OR email = $2", ...)` (lines 18-21) and `pool.query("INSERT INTO users (...) VALUES (...)", [...])` (lines 31-34); `login` runs `pool.query("SELECT username, password FROM users WHERE username = $1", [username])` (lines 57-58). In-memory array is gone. Met.

2. **Field mismatches** — `register` reads `phone` from `req.body` (line 6), not `phone_number`, and the INSERT targets the `phone` column (line 32). `role` is set to the literal `'student'` in the INSERT (line 32), satisfying the `role role_enum NOT NULL` column with no default (`backend/database/tables/users.js`). `'student'` is a valid enum value. Met.

3. **Filename typos** — `lisitng.controller.js` → `listing.controller.js` and `category.auth.js` → `category.controller.js` (git renames, 0 bytes). Directory listing confirms only the corrected names exist; ripgrep for `lisitng|category\.auth` across `backend/**/*.js` returns no matches. `backend/routes/listing.routes.js` and `category.routes.js` are empty (0 bytes), so no imports to update. Met.

4. **app.js DB check** — `backend/app.js` changed `console.log(result.row[0])` → `console.log(result.rows[0])`. Met.

5. **CORS + JSON parsing** — `backend/app.js` adds `app.use(cors({ origin: 'http://localhost:5173', credentials: true }))` (explicit origin, not open) and `app.use(express.json())`. `cors` is already a declared dependency (`backend/package.json`, `^2.8.6`) and is installed, so the import introduces no new library and will not break boot. Coder recorded a preflight probe returning 204 with `access-control-allow-origin: http://localhost:5173`. Met.

6. **No full API client** — frontend diff contains only currency string changes (ShopPage, HomePage, App.jsx subtotal, FeaturesBar); no data layer or new helper added. Met.

7. **Currency → Ghana Cedis** — All price displays in `frontend/src/` now use `GH₵` (ShopPage.jsx prices/originalPrice, slider bounds, filter chip; HomePage.jsx; App.jsx cart subtotal line ~135; FeaturesBar.jsx line 24). The `₵` glyph is used directly. Ripgrep for `\$` in `frontend/src/**/*.{jsx,js}` finds only JS template-literal interpolation (`${...}`) and one decorative SVG glyph. "Align backend currency formatting" is vacuously satisfied: the only `$` occurrences in `backend/**/*.js` are pg parameter placeholders (`$1..`); no backend price/currency formatting code exists. Met.

## Checks that prove the work

1. **Backend starts / DB check not undefined** — `result.rows[0]` is correct (pg returns `rows`); `node --check` on app.js recorded as passing; `cors` installed. Full boot stdout not captured (runner can't return long-running node output) but no syntax/runtime issue is evident. Acceptable.
2. **CORS preflight** — coder recorded 204 with the explicit `http://localhost:5173` origin and credentials true. Acceptable.
3. **Auth round-trip** — DB credentials fail in this environment, so the round-trip was not run. Fallback code-review criteria all met: `pool.query`, parameterized queries, `bcrypt.hash` on register (line 28), `bcrypt.compare` + `jwt.sign` on login (lines 64-76), `role` defaulted to `'student'`, `phone` column used. Acceptable.
4. **No phone_number mismatch / role always set** — confirmed; `phone_number` survives only in this report file, not in code.
5. **No `$` in price displays** — confirmed; only a decorative icon glyph and template literals remain (see note).
6. **Filenames fixed / no broken imports** — confirmed.
7. **`result.rows` plural** — confirmed.

## Non-blocking observation (not a finding)

`frontend/src/components/Icons.jsx:297` — the `BadgePrices` component renders a decorative 24×24 SVG shield containing a `$` `<text>` glyph, used in `Footer.jsx` beside the "Best Prices / Unbeatable prices" label. This is a generic money badge, not a price display with an amount, so it falls outside the "price displays" scope of proving check #5. Left as-is; not flagged.

## Verdict

APPROVED — no material blockers. All seven task items and all proving checks are satisfied (with the two DB-dependent checks satisfied via the documented fallback / code-review path, as allowed).
