-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "tipoVenda" TEXT NOT NULL DEFAULT 'VENDA_DIRETA',
    "compradorNome" TEXT NOT NULL,
    "compradorCpfCnpj" TEXT,
    "compradorEndereco" TEXT,
    "compradorCidade" TEXT,
    "compradorEstado" TEXT,
    "compradorCep" TEXT,
    "valorTotal" REAL NOT NULL,
    "dataVenda" DATETIME NOT NULL,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_invoices" ("compradorCep", "compradorCidade", "compradorCpfCnpj", "compradorEndereco", "compradorEstado", "compradorNome", "createdAt", "dataVenda", "id", "numero", "observacoes", "status", "updatedAt", "valorTotal") SELECT "compradorCep", "compradorCidade", "compradorCpfCnpj", "compradorEndereco", "compradorEstado", "compradorNome", "createdAt", "dataVenda", "id", "numero", "observacoes", "status", "updatedAt", "valorTotal" FROM "invoices";
DROP TABLE "invoices";
ALTER TABLE "new_invoices" RENAME TO "invoices";
CREATE UNIQUE INDEX "invoices_numero_key" ON "invoices"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
