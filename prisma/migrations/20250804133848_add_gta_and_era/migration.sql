-- AlterTable
ALTER TABLE "animals" ADD COLUMN "era" TEXT;

-- CreateTable
CREATE TABLE "gtas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT,
    "origem" TEXT,
    "destino" TEXT,
    "dataEmissao" DATETIME,
    "finalidade" TEXT,
    "transportador" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
