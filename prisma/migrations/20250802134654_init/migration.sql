-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "animals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brinco" TEXT NOT NULL,
    "serie" TEXT,
    "nome" TEXT,
    "raca" TEXT,
    "sexo" TEXT NOT NULL,
    "dataNasc" DATETIME,
    "peso" REAL,
    "categoria" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "pai" TEXT,
    "mae" TEXT,
    "avoMaterno" TEXT,
    "receptora" TEXT,
    "tipoCobertura" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "animals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gestations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataCobertura" DATETIME NOT NULL,
    "dataPrevParto" DATETIME NOT NULL,
    "dataRealParto" DATETIME,
    "touroId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GESTANTE',
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "animalId" TEXT NOT NULL,
    CONSTRAINT "gestations_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peso" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animalId" TEXT NOT NULL,
    CONSTRAINT "weights_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "costs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "categoria" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "animalId" TEXT,
    CONSTRAINT "costs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "costs_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "prioridade" TEXT NOT NULL DEFAULT 'MEDIA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "produto" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "unidade" TEXT NOT NULL,
    "mercado" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "fonte" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sale_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "local" TEXT,
    "descricao" TEXT,
    "comissao" REAL,
    "taxas" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "sale_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valor" REAL NOT NULL,
    "dataVenda" DATETIME NOT NULL,
    "comprador" TEXT,
    "documento" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "formaPagamento" TEXT,
    "observacoes" TEXT,
    "comissao" REAL,
    "taxas" REAL,
    "valorLiquido" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "animalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saleEventId" TEXT,
    CONSTRAINT "sales_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_saleEventId_fkey" FOREIGN KEY ("saleEventId") REFERENCES "sale_events" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "animals_brinco_key" ON "animals"("brinco");
