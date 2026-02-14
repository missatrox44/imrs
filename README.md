# IMRS Biodiversity Explorer

[Deployed Link (MVP)](https://imrs.vercel.app/)

## Purpose
This web application was created for students, researchers, and visitors interested in exploring the biodiversity of Indio Mountains Research Station (IMRS), managed by The University of Texas at El Paso (UTEP).

It combines modern observation data from iNaturalist with a digital species catalogue from the official IMRS handbook:

[NATURAL RESOURCES AND PHYSICAL ENVIRONMENT OF INDIO MOUNTAINS RESEARCH STATION (IMRS), SOUTHEASTERN HUDSPETH COUNTY, TEXAS — A HANDBOOK FOR STUDENTS AND RESEARCHERS.](https://www.utep.edu/science/indio/_files/docs/imrs%20natural%20resources.pdf)

By making the handbook’s species records digital, organized, searchable, and filterable, the app becomes a living reference for the Chihuahuan Desert flora and fauna found on IMRS.



## Tech Stack
*Frontend*
- Frameworks: TanStack Start (React)
- Routing: TanStack Router
- Data Fetching/Caching: TanStack Query
- Language/Build: TypeScript + Vite
- Styling: Tailwind & ShadCN


*Data Sources*
- [iNaturalist API](https://www.inaturalist.org/pages/api+reference) - observation data for IMRS vicinity
- IMRS Handbook - authoritative species list, normalized into SQL tables

*Backend/Database*
- [SQLite3](https://formulae.brew.sh/formula/sqlite)
- [Turso](https://turso.tech/)

### Install SQLite3 (Mac)
Check if SQLite3 is installed first:
`sqlite3 --version`
If you see a version number, you're good! If not enter:
`brew install sqlite3`

1. Create database and table:

```bash 
sqlite3 imrs-species.db "
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
"
```

2. Verify table exists
  
`sqlite3 imrs-species.db ".schema specimens"`


3. **Import TSV**
go to terminal at root of project and enter:

`sqlite3 imrs-species.db`

Then inside the SQLite prompt:
```bash
.mode tabs
.headers on
.import specimens.tsv specimens
```

4.check that it worked

`sqlite3 imrs-species.db ;"`

## [Preparing Your SQLite Database](https://turso.tech/blog/migrating-and-importing-sqlite-to-turso-just-got-easier#preparing-your-sqlite-database)
Before importing your SQLite database to Turso Cloud, your database should be using WAL (Write-Ahead Logging) mode:

Open your SQLite database using the SQLite command-line tool:

`sqlite3 path/to/your/database.db`

Set WAL to journal mode:

`PRAGMA journal_mode=WAL;`

Checkpoint and truncate the WAL file:

`PRAGMA wal_checkpoint(TRUNCATE);`

Verify the journal mode is set to WAL:

`PRAGMA journal_mode;`

Exit the SQLite shell:

`.exit`


### Turso CLI Thangs
- Login

If using Turso account managed by Vercel, login with the following

`turso auth login --headless`


- Then run command:
   
`turso config set token "YOUR_TOKEN_HERE"`

- Confirm logged in (personal default)

`turso auth whoami`

- Switch to vercel org
   
`turso org list`

`turso org switch [vercel-team-name]`

   Verify switch:

`turso org list`



## [Push to Turso](https://turso.tech/blog/migrating-and-importing-sqlite-to-turso-just-got-easier#using-the-turso-cli)

`turso db import ~/path/to/my-database.db`








## Turso Notes
```javascript
//node.js
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


//edge ?
import { createClient } from "@libsql/client/web";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

```javascript
//next example
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const POST = async () => {
  // Fetch data from SQLite
  const result = await client.execute("CREATE TABLE todos (description);");
};
```


## iNaturalist Resources
- [IMRS Location](https://www.inaturalist.org/places/indio-mountains-research-station)
- [Developer Docs](https://www.inaturalist.org/pages/developers)
- [API Reference](https://www.inaturalist.org/pages/api+reference)
- [iNaturalist API](https://api.inaturalist.org/v1/docs/)

### Rate Limits
We throttle API usage to a max of 100 requests per minute, though we ask that you try to keep it to 60 requests per minute or lower. If we notice usage that has serious impact on our performance we may institute blocks without notification. The API is intended to support application development, not data scraping. If you want data, see the datasets below.

### iNaturalist API Authentication (NOT USED IN THIS REPO)
🗒️ *THE FOLLOWING IS JUST PERSONAL NOTES*
Authentication is only required when requesting [private data](https://www.inaturalist.org/pages/api+recommended+practices). 

Get JWT Token from:
`https://www.inaturalist.org/users/api_token`

```javascript
//send JWT in the Authorization header
const response = await fetch(
  'https://api.inaturalist.org/v1/observations?per_page=50',
  {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  }
);
```
