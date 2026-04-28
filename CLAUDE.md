# Patisserie Patel – Bestelapp

React-based ordering web app for Patisserie Patel. Customers scan a QR code printed on a card at client premises, which opens this app and loads products linked to their organisation.

## Stack
- **Frontend**: React 19 + Vite, Material UI (MUI) v9, React Router v7
- **Backend**: Express 5 — OAuth token manager + Zoho API proxy + static file serving
- **Data**: Zoho Creator REST API v2
- **Tests**: Vitest + React Testing Library

## Commands
```bash
npm run dev          # dev server (Express + Vite concurrently)
npm run build        # production build (outputs to dist/)
npm start            # serve production build on port 3001
npm run test         # run unit tests (watch mode)
npx vitest run       # run tests once
```

## Environment variables
Copy `.env.example` to `.env.local` and fill in:
| Variable | Description |
|----------|-------------|
| `ZOHO_CLIENT_ID` | Zoho OAuth client ID |
| `ZOHO_CLIENT_SECRET` | Zoho OAuth client secret |
| `ZOHO_REFRESH_TOKEN` | Zoho OAuth refresh token |
| `ZOHO_OWNER_NAME` | Zoho account owner name (e.g. `pastel`) |
| `ZOHO_APP_NAME` | Zoho Creator app link name (e.g. `bestelapp-development`) |
| `ZOHO_API_BASE_URL` | Zoho Creator API base URL (EU: `https://creator.zoho.eu/api/v2`) |
| `ZOHO_TOKEN_URL` | OAuth token endpoint (default: `https://accounts.zoho.eu/oauth/v2/token`) |
| `PORT` | Server port (default: `3001`) |

OAuth credentials are server-side only — never exposed to the browser. The frontend calls `/api/zoho/*` which the Express server proxies to Zoho with a valid Bearer token.

Required OAuth scopes: `ZohoCreator.report.READ,ZohoCreator.form.CREATE`

## Zoho Creator reports used
| Report / Form | Purpose | Key fields |
|---------------|---------|------------|
| `Organisaties_Report` | Organisation by ID (direct record lookup) | `naam`, `Cutoff_tijd_in_uren`, `Product_Groep` |
| `Product_Groep_Report` | Product groups linked to organisation | `Naam`, `Producten` (list of product IDs) |
| `Producten_Report` | Full product records | `Naam`, `Qty_per_doos`, `Omschrijving` |
| `Aankondigingen_Report` | Announcements per organisation | `Naam`, `Aankondiging`, `Organisaties` (BIGINTLIST), `Start_datum_tijd`, `Eind_datum_tijd` |
| `Bestellingen` (form) | Order creation | `Order_date`, `Organisatie`, `Producten`, `Status` |

### Zoho criteria gotchas
- Organisation ID lookup: use direct record URL `/report/Organisaties_Report/{id}`, not criteria
- `ID` fields are NUMBER type — no quotes in criteria: `ID==258089000000011066`
- `Organisaties` in Aankondigingen is BIGINTLIST — use `in` operator: `(Organisaties in {id})`
- Date format for form submission: `dd-MMM-yyyy HH:mm:ss` (e.g. `28-Apr-2026 13:50:11`)

## Architecture
```
server/
├── index.js              # Express server: API proxy + static serving in production
├── zohoProxy.js          # Middleware: proxies /api/zoho/* to Zoho Creator with Bearer token
└── zohoTokenManager.js   # OAuth refresh token flow with in-memory token caching

src/
├── theme.js              # MUI theme (brand colours, fonts, component overrides)
├── services/
│   └── zohoCreator.js    # Zoho Creator REST API wrapper (all API calls go here)
├── utils/
│   ├── deliveryDates.js  # Delivery date calculation based on cutoff hour
│   └── zohoDate.js       # parseZohoDate / formatZohoDate helpers
├── hooks/
│   ├── useOrganisation.js   # Fetch org by ID
│   ├── useProducts.js       # Two-step fetch: product groups → product records
│   ├── useAnnouncements.js  # Fetch active announcements (filtered by date range), sort by Start_datum_tijd
│   └── useCart.js           # Cart state (add/update/remove/clear)
├── components/
│   ├── AnnouncementModal    # MUI Dialog, shown for first active announcement
│   ├── ProductTile          # MUI Card in product grid (badge shows cart qty)
│   ├── ProductModal         # MUI Dialog with quantity selector
│   └── Cart                 # MUI Paper: order summary, delivery date, T&C, submit
├── pages/
│   ├── OrderPage            # Main ordering page (?organisatie_id=xxx)
│   └── ThankYouPage         # Post-order confirmation (/bedankt)
└── assets/
    └── logo.png             # Brand logo (also used as public/favicon.png)
```

## Product loading (two-step fetch)
1. Organisation record contains `Product_Groep` — list of linked product group IDs
2. Fetch those groups from `Product_Groep_Report` to get their `Producten` field (product IDs)
3. Fetch full product records from `Producten_Report` using those IDs

## Announcement logic
- Filtered by `Organisaties in {organisatieId}` criteria
- Active = current time is between `Start_datum_tijd` and `Eind_datum_tijd` (filtered client-side)
- Sorted oldest `Start_datum_tijd` first; the first one is shown in the modal

## Delivery date logic
`Cutoff_tijd_in_uren` is the hour of day (0–23) after which next-day delivery is no longer possible. When ≥ 24, a minimum 2-day lead time is enforced.

## Brand
- **Primary**: Raspberry `#9d2f6a`, Terra Peach `#e5af9f`
- **Dark**: Plum `#491030`
- **Light**: Vanilla `#efe8d1`
- **Accent**: Pistache `#b49a18`
- **Fonts**: Cormorant Garamond (headings/logo), Outfit (body), Mansalva (accent/logo)
- Mobile-first, max-width 520 px
- MUI theme defined in `src/theme.js` — edit colours and component defaults there
