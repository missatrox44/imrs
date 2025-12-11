// import { getDb } from "@/server/db";
// import { getTurso } from "@/server/turso";

// function rowsToObjects(columns: Array<any> | undefined, rows: Array<any>) {
//   const colNames = (columns || []).map((c: any) => (typeof c === "string" ? c : c.name));
//   return rows.map((r: Array<any>) =>
//     Object.fromEntries(colNames.map((n: string, i: number) => [n, r[i]]))
//   );
// }

// export const GET = async () => {
//   // If TURSO_DATABASE_URL is configured, query Turso (libsql client).
//   if (process.env.TURSO_DATABASE_URL) {
//     const db = getTurso();
//     const result = await db.execute({ sql: `SELECT * FROM specimens` });
//     // `result` shape: { columns, rows }
//     const items = rowsToObjects(result.columns, result.rows);
//     return Response.json(items);
//   }

//   // Fallback to local sqlite file (development)
//   const db = getDb();
//   const rows = db.prepare(`SELECT * FROM specimens`).all();
//   return Response.json(rows);
// };

import { getDb } from "@/server/db";

export const GET = () => {
  const db = getDb();

  try {
    const rows = db.prepare("SELECT * FROM specimens").all();
    return Response.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    return new Response("Database error", { status: 500 });
  }
};