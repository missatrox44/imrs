# IMRS Biodiversity Explorer

[Live Deployment](https://imrs.vercel.app/)

## The Challenge

For years, the biodiversity records of the **Indio Mountains Research Station (IMRS)**—a 40,000-acre research facility in the Chihuahuan Desert managed by UTEP—were locked away in a static PDF handbook: _[Natural Resources and Physical Environment of Indio Mountains Research Station](https://www.utep.edu/science/indio/_files/docs/imrs%20natural%20resources.pdf)_.

While authoritative, this format made it difficult for students, researchers, and visitors to quickly identify species, cross-reference data, or access information while in the field.

## The Solution

The **IMRS Biodiversity Explorer** transforms this static data into a living, interactive digital resource. By normalizing the handbook's data into a structured SQL database and integrating real-time observations from iNaturalist, this application provides a powerful tool for exploring the station's flora and fauna.

## Key Features

- **Digital Species Catalog**: A fully searchable and filterable database of all species recorded in the station's history.
  - **Dual Views**: Switch between a visual Grid View for browsing and a detailed Table View for data analysis.
  - **Advanced Filtering**: Filter by Taxonomy (Kingdom, Phylum, Class, Order, Family, Genus).
  - **Smart Search**: Instantly find species by scientific or common names.
- **Recent Observations**: Real-time integration with the **iNaturalist API** to display the latest confirmed sightings at the station.
- **Gazetteer**: A reference for key geographical locations within the research station.

## Technology Stack

**Frontend**

- **Framework**: [TanStack Start](https://tanstack.com/start) (React)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Maps**: Leaflet / React-Leaflet

**Backend & Data**

- **Database**: [SQLite3](https://sqlite.org/) (Local) / [Turso](https://turso.tech/) (Production)
- **ORM/Querying**: Raw SQL & `better-sqlite3` / `@libsql/client`
- **External API**: iNaturalist

## Security

Responses are served with a strict Content-Security-Policy and the usual
hardening headers (`X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`), configured via Nitro `routeRules` in
`vite.config.ts` and applied at build time.

Rate limiting and abuse protection are intentionally handled at the edge by the
Vercel WAF / Firewall rather than in application code, so the app stays
stateless and the same policy applies across all routes.

## Future Roadmap

- **Authentication & Admin Dashboard**: Implement secure login for station administrators to manage and update the species index directly (CRUD operations).
- **Weather Integration**: Visualize historical and real-time climate data from on-site weather stations to correlate biodiversity trends with environmental conditions.
- **Open Source**: Prepare the codebase for public contribution, assisting other field stations in digitizing their records.

---

## Getting Started

### Prerequisites

- Node.js (v22+, see `.nvmrc`)
- pnpm (the repo pins a version via the `packageManager` field)
- SQLite3 (for local database management)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/missatrox44/imrs.git
   cd imrs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```bash
   cp .env.sample .env
   ```

   _Note: For local development, you typically only need the `DATABASE_URL` pointing to your local SQLite file (e.g., `file:local.db`)._

4. **Run the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Database Setup

The application uses SQLite. In production, we use Turso.

### 1. Local SQLite Setup (Mac)

Check if SQLite3 is installed:

```bash
sqlite3 --version
# If not installed:
brew install sqlite3
```

**Initialize Database:**

```bash
# Create DB and Table
sqlite3 imrs-species.db

# In SQLite prompt:
CREATE TABLE specimens (
  id INTEGER PRIMARY NOT NULL,
  category TEXT,
  kingdom TEXT,
  phylum TEXT,
  phylum_common_name TEXT,
  sub_phylum TEXT,
  sub_phylum_common_name TEXT,
  class_name TEXT,
  class_common_name TEXT,
  sub_class TEXT,
  sub_class_common_name TEXT,
  order_name TEXT,
  order_common_name TEXT,
  sub_order TEXT,
  sub_order_common_name TEXT,
  family TEXT,
  family_common_name TEXT,
  sub_family TEXT,
  sub_family_common_name TEXT,
  genus TEXT,
  species TEXT,
  authorship TEXT,
  collectors_field_numbers TEXT,
  note TEXT,
  species_common_name TEXT,
  records TEXT,
  iucn_category TEXT,
  natureserve_grank TEXT,
  natureserve_srank_tx TEXT,
  natureserve_id TEXT
);

# Import Data (ensure specimens.tsv is in root)
.mode tabs
.headers on
.import specimens.tsv specimens

# Verify
SELECT count(*) FROM specimens;
.exit
```

### 2. Migration to Turso (Production)

[Turso Migration Guide](https://turso.tech/blog/migrating-and-importing-sqlite-to-turso-just-got-easier)

**Prepare Local DB:**

```bash
sqlite3 imrs-species.db "PRAGMA journal_mode=WAL;"
sqlite3 imrs-species.db "PRAGMA wal_checkpoint(TRUNCATE);"
```

**Push to Turso:**

```bash
# Auth
turso auth login
turso config set token "YOUR_TOKEN"

# Import
turso db import imrs-species.db
```

### 3. Conservation Status

The four `iucn_category` / `natureserve_*` columns are populated by a seed
script that fetches conservation status from two free sources:

- **NatureServe Explorer** — no API key. Provides the global G-rank and the
  Texas subnational S-rank.
- **IUCN Red List API v4** — free, but requires a registered token. Set
  `IUCN_API_TOKEN` in `.env.local`. If it's omitted, the script seeds
  NatureServe only and skips IUCN.

These calls happen only at seed time — the app makes no external conservation
requests at runtime. The script adds the columns idempotently (so it's safe on
an existing DB) and is resumable (it skips species that already have data; pass
`--force` to reprocess all).

```bash
# Seed the local DB (NatureServe + IUCN)
IUCN_API_TOKEN=your_token npx tsx scripts/seed-conservation.ts
```

To propagate the seeded data to the **existing** production Turso DB, update it
in place. `turso db import` only ever creates a _new_ database, so it can't
update the live one — instead generate an idempotent migration from the local
DB and apply it with `turso db shell`:

```bash
# Generate ALTERs + UPDATEs from the freshly-seeded local DB
{
  echo "ALTER TABLE specimens ADD COLUMN iucn_category TEXT;"
  echo "ALTER TABLE specimens ADD COLUMN natureserve_grank TEXT;"
  echo "ALTER TABLE specimens ADD COLUMN natureserve_srank_tx TEXT;"
  echo "ALTER TABLE specimens ADD COLUMN natureserve_id TEXT;"
  sqlite3 imrs-species.db "SELECT 'UPDATE specimens SET iucn_category='||quote(iucn_category)||', natureserve_grank='||quote(natureserve_grank)||', natureserve_srank_tx='||quote(natureserve_srank_tx)||', natureserve_id='||quote(natureserve_id)||' WHERE id='||id||';' FROM specimens WHERE iucn_category IS NOT NULL OR natureserve_grank IS NOT NULL OR natureserve_srank_tx IS NOT NULL OR natureserve_id IS NOT NULL;"
} > conservation-updates.sql

# Apply to the production DB (the ALTERs are one-time; ignore "duplicate column" if re-running)
turso db shell <your-db> < conservation-updates.sql
rm conservation-updates.sql
```

> The columns must exist in production for the badges to render. If one is
> missing the app degrades gracefully (no badge) — it does not error.

Conservation data courtesy of [NatureServe Explorer](https://explorer.natureserve.org/)
and the [IUCN Red List](https://www.iucnredlist.org/).

---

## iNaturalist Resources

- [IMRS Location ID](https://www.inaturalist.org/places/indio-mountains-research-station)
- [API Reference](https://www.inaturalist.org/pages/api+reference)
