# Patisserie Patel – Bestelapp

React-based ordering web app for Pastisserie Patel. Customers scan a QR code printed on a card at client premises, which opens this app and loads products linked to their organisation.

## Stack
- **Frontend**: React 19 + Vite, CSS Modules, React Router v7
- **Data**: Zoho Creator REST API v2 (primary), Drizzle fallback (backend)
- **Tests**: Vitest + React Testing Library

## Commands
```bash
npm run dev          # development server
npm run build        # production build
npm run test         # run unit tests (watch)
npx vitest run       # run tests once
```

## Environment variables
Copy `.env.example` to `.env.local` and fill in:
| Variable | Description |
|----------|-------------|
| `VITE_ZOHO_API_BASE_URL` | Zoho Creator API base URL (EU: `https://creator.zoho.eu/api/v2`) |
| `VITE_ZOHO_OWNER_NAME` | Zoho account owner name |
| `VITE_ZOHO_APP_NAME` | Zoho Creator app link name |
| `VITE_ZOHO_ACCESS_TOKEN` | OAuth access token (dev only – use backend proxy in prod) |

## Zoho Creator reports used
| Report | Purpose |
|--------|---------|
| `Organisaties_Report` | Organisation details + `Cutoff_tijd_in_uren` |
| `Product_Groep_Report` | Products per organisation (fields: `Naam`, `Qty_per_doos`, `Omschrijving`) |
| `Aankondigingen_Report` | Active announcements (field: `Actief`, `Titel`, `Bericht`, `Added_Time`) |
| `Bestellingen` (form) | Order creation (fields: `Order_date`, `Organisaties`, `Producten`, `Leveringsdatum`, `Status`) |

## Architecture
```
src/
├── services/zohoCreator.js   # Zoho Creator REST API wrapper
├── hooks/
│   ├── useOrganisation.js    # fetch org by ID
│   ├── useProducts.js        # fetch products for org
│   ├── useAnnouncements.js   # fetch active announcements, sort oldest first
│   └── useCart.js            # cart state (add/update/remove/clear)
├── components/
│   ├── AnnouncementModal     # announcement popup (oldest active shown first)
│   ├── ProductTile           # product card in grid (shows badge if in cart)
│   ├── ProductModal          # product detail popup with qty selector
│   └── Cart                  # order summary, delivery date picker, T&C, submit
├── pages/
│   ├── OrderPage             # main ordering page (?organisatie_id=xxx)
│   └── ThankYouPage          # post-order confirmation (/bedankt)
└── utils/deliveryDates.js    # delivery date calculation based on cutoff hour
```

## Delivery date logic
`Cutoff_tijd_in_uren` from the organisation record is the hour of day (0–23) after which next-day delivery is no longer possible. When ≥ 24, a minimum 2-day lead time is enforced.

## Brand
- **Primary**: Raspberry `#9d2f6a`, Terra Peach `#e5af9f`
- **Dark**: Plum `#491030`
- **Light**: Vanilla `#efe8d1`
- **Accent**: Pistache `#b49a18`
- **Fonts**: Cormorant Garamond (headings), Outfit (body), Mansalva (accent)
- Mobile-first, max-width 520 px
