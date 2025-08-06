-- AlterTable
ALTER TABLE "animals" ADD COLUMN "dataVenda" DATETIME;
ALTER TABLE "animals" ADD COLUMN "valorVenda" REAL;

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "invoice_animals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preco" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    CONSTRAINT "invoice_animals_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "invoice_animals_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_numero_key" ON "invoices"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_animals_invoiceId_animalId_key" ON "invoice_animals"("invoiceId", "animalId");
