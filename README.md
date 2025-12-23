# IMRS Biodiversity Explorer

[Deployed Link (WIP)](https://imrs.vercel.app/)

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


## TanStack Start Stuffs:

To run this application:

```bash
npm install
npm run start
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
