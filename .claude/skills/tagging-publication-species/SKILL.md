---
name: tagging-publication-species
description: Use when adding a publication (thesis, paper, report) to the IMRS Biodiversity Explorer and linking the species it mentions — extracting species lists from a PDF, matching names against the Turso specimens table, inserting missing species rows, and adding a speciesIds entry to src/data/publications.ts.
---

# Tagging Publication Species

## Overview

Link a publication to every species it documents: extract species from the source PDF into a root-level `.md` file, resolve each name to a `specimens.id` in the Turso `imrs` database, insert rows for species genuinely absent, then add the publication with its `speciesIds` to `src/data/publications.ts`.

## Steps

### 1. Get the PDF

`curl` and Node `fetch` fail on repository sites (ScholarWorks returns 0 bytes to non-browser clients). Use the chrome-devtools MCP instead: `new_page` to the PDF URL, then `evaluate_script` with fetch → blob → `<a download>` click. The file lands in `~/Downloads`. If that fails, ask the user for the file.

### 2. Extract species to a root .md file

Read the PDF pages the user names (Read tool handles PDFs; use `pages`). Write `<topic>-species-observed.md` at the repo root containing:

- Full citation with URL
- Tables of scientific names, grouped as the thesis groups them
- Notes column: new-IMRS-record flags, singletons, thesis misspellings (record the corrected name AND the thesis spelling)
- Genus-only records (`Xxx spp.`) and unidentified morphospecies: list them, but they get no `speciesIds` link

### 3. Match names against the DB

Query with the turso CLI (`turso db shell imrs`), not one-off `@libsql/client` scripts. Match on `genus` + `species` in `specimens`.

A name that returns no row is usually NOT missing. Check, in order:

1. **DB misspelling** — query by genus alone or `like` fragments (found: `Chrysactina` for _Chrysactinia_, `trifololiata` for _trifoliolata_, `Peratettix` for _Paratettix_, `equs` for _eques_)
2. **Synonym / modern genus** — the DB stores accepted names (_Acacia constricta_ → _Vachellia constricta_, _Acacia greggii_ → _Senegalia greggii_)
3. **Genuinely absent** — only then insert

### 4. Insert missing species

The `.env.local` `TURSO_AUTH_TOKEN` is **read-only**. Writes go through `turso auth login` (persists) then `turso db shell imrs < file.sql`.

Before writing INSERTs, SELECT a sibling row (same family) and copy its conventions exactly:

| Convention               | Example                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| id                       | `max(id) + 1`, sequential                                                               |
| family/subfamily         | UPPERCASE (`ACRIDIDAE`, `POACEAE`)                                                      |
| authorship               | `(Surname)` parenthesized per original combination; `(Michaux) Torrey` style for plants |
| collectors_field_numbers | `[Surname (UTEP)]`                                                                      |
| species_common_name      | curly apostrophes (`Thomas’s`)                                                          |
| records                  | starts lowercase: `it was collected...`; name the collector, site, survey               |
| empty taxonomy levels    | `''` if sibling rows use `''`, else NULL                                                |
| conservation columns     | leave NULL                                                                              |

Verify with a SELECT after inserting.

### 5. Add the publications.ts entry

In `src/data/publications.ts`: id slug `surname-year-type`, full title, `authors`, `year`, `type`, `url`, `speciesIds` sorted ascending. Theses are ordered alphabetically by author — insert in position.

### 6. Verify

- Script: `node --env-file=.env.local --experimental-strip-types <script.mjs>` that imports `publications.ts` (import `@libsql/client` via the absolute `node_modules/@libsql/client/lib-esm/node.js` path) and checks every `speciesIds` entry resolves in the DB with no duplicates.
- `pnpm test`

### 7. Report — do not commit

Leave `publications.ts` and the `.md` file uncommitted; report paths. Report any DB misspellings found but not fixed.

## Common Mistakes

| Mistake                                                                  | Fix                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------- |
| Inserting a "missing" species that is a misspelling or synonym in the DB | Run the step-3 checks first                         |
| Writing with the `.env.local` token                                      | It is read-only; use `turso auth login` + CLI shell |
| Linking genus-only or unidentified records                               | List them in the .md, exclude from `speciesIds`     |
| Inventing row formatting                                                 | Copy a sibling row's conventions verbatim           |
| Committing the result                                                    | Never; commits are manual-trigger only              |
