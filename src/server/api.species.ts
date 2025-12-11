// // 🌵 DOUBLE CHECK
// import { getDb } from './db'

// export async function getSpeciesList(search?: string) {
//   const db = getDb()
//   let rows
//   if (search) {
//     const like = `%${search.toLowerCase()}%`
//     rows = db.prepare(`
//       SELECT id, family, common_name, note as notes,
//              TRIM(COALESCE(genus,'') || ' ' || COALESCE(species,'')) as scientific_name,
//              category
//       FROM specimen
//       WHERE LOWER(genus || ' ' || species) LIKE ?
//          OR LOWER(common_name) LIKE ?
//          OR LOWER(family) LIKE ?
//       ORDER BY scientific_name
//     `).all(like, like, like)
//   } else {
//     rows = db.prepare(`
//       SELECT id, family, common_name, note as notes,
//              TRIM(COALESCE(genus,'') || ' ' || COALESCE(species,'')) as scientific_name,
//              category
//       FROM specimen
//       ORDER BY scientific_name
//     `).all()
//   }

//   return rows.map(r => ({
//     id: r.id,
//     scientific_name: r.scientific_name,
//     common_name: r.common_name,
//     family: r.family,
//     notes: r.notes,
//     category: r.category as string,
//   }))
// }

// src/routes/api/species/index.ts
import { getDb } from "@/server/db";

export const GET = () => {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM specimens`).all();
  return Response.json(rows);
};