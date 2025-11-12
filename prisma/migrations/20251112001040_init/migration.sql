-- CreateTable
CREATE TABLE "Specimen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "kingdom" TEXT NOT NULL,
    "phylum" TEXT NOT NULL,
    "subPhylum" TEXT,
    "className" TEXT NOT NULL,
    "orderName" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "authorship" TEXT,
    "collectorsFieldNumbers" TEXT,
    "note" TEXT,
    "commonName" TEXT,
    "records" TEXT
);
