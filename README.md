# IMRS Biodiversity Explorer

[Live Deployment](https://imrs.vercel.app/)

## The Challenge

For years, the biodiversity records of the **Indio Mountains Research Station (IMRS)**, a 40,000-acre research facility in the Chihuahuan Desert managed by UTEP, were locked away in a static PDF handbook: _[Natural Resources and Physical Environment of Indio Mountains Research Station](https://www.utep.edu/science/indio/_files/docs/imrs%20natural%20resources.pdf)_.

While authoritative, this format made it difficult for students, researchers, and visitors to quickly identify species, cross-reference data, or prepare for their upcoming trip to IMRS.

## The Solution

The **IMRS Biodiversity Explorer** turns that handbook into a living, interactive website. Anyone such as a student, a researcher, or a curious visitor, can search the station's plants and animals, see where recent sightings have been reported, check how each species is doing conservation-wise, and explore five years of on-site weather. It's the field guide and the data prospective researchers and visitors alike can use to prepare for their trip.

## Features

- **Species Catalog** — search and filter every species ever recorded at the station, in a visual grid or a detailed table.
- **Conservation Status** — at-a-glance badges show how each species is doing, drawn from NatureServe and the IUCN Red List.
- **Recent Observations** — Real-time integration with the **iNaturalist API** to display the latest confirmed sightings at IMRS
- **Climate & Weather** — five years (2020–2024) of the station's weather, charted and filterable by year and season.
- **Gazetteer** — an interactive map of the named places across the station.

## Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React) — Router, Query, Table & Virtual
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Maps**: Leaflet / React-Leaflet
- **Database**: [Turso](https://turso.tech/) (cloud SQLite) via `@libsql/client`
- **External API**: [iNaturalist](https://www.inaturalist.org/)

Also uses Recharts (weather charts), Framer Motion (animation), Zod (validation),
and Vercel Analytics / Speed Insights.

## Roadmap

- **Authentication & Admin Dashboard**: Implement secure login for station administrators to manage and update the species index directly (CRUD operations).
- **Open Source**: The codebase is clean and well-tested; the remaining work is a contribution guide (`CONTRIBUTING.md`) and setup docs to help other field stations digitize their records.

---

## Getting Started

### Prerequisites

- Node.js (v24, see `.nvmrc`)
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
   Open [http://localhost:3001](http://localhost:3001) to view the app.

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
