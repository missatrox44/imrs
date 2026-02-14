# IMRS Biodiversity Explorer

[Live Deployment](https://imrs.vercel.app/)

## The Challenge
For years, the biodiversity records of the **Indio Mountains Research Station (IMRS)**—a 40,000-acre research facility in the Chihuahuan Desert managed by UTEP—were locked away in a static PDF handbook: *[Natural Resources and Physical Environment of Indio Mountains Research Station](https://www.utep.edu/science/indio/_files/docs/imrs%20natural%20resources.pdf)*.

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

## Future Roadmap
- **Authentication & Admin Dashboard**: Implement secure login for station administrators to manage and update the species index directly (CRUD operations).
- **Weather Integration**: Visualize historical and real-time climate data from on-site weather stations to correlate biodiversity trends with environmental conditions.
- **Open Source**: Prepare the codebase for public contribution, assisting other field stations in digitizing their records.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- SQLite3 (for local database management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/missatrox44/imrs.git
   cd imrs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.sample .env
   ```
   *Note: For local development, you typically only need the `DATABASE_URL` pointing to your local SQLite file (e.g., `file:local.db`).*

4. **Run the development server**
   ```bash
   npm run dev
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
  records TEXT
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

---

## iNaturalist Resources
- [IMRS Location ID](https://www.inaturalist.org/places/indio-mountains-research-station)
- [API Reference](https://www.inaturalist.org/pages/api+reference)
