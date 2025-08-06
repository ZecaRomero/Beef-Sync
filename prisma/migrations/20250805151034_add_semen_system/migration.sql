-- CreateTable
CREATE TABLE "semen_containers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "botijaoNumero" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "capacidade" INTEGER NOT NULL,
    "dataAquisicao" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "temperatura" REAL,
    "nivelNitrogeno" REAL,
    "proximaManutencao" DATETIME,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "semen_containers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "semen_canecas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "ocupacao" INTEGER NOT NULL DEFAULT 0,
    "posicoes" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "containerId" TEXT NOT NULL,
    CONSTRAINT "semen_canecas_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "semen_containers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "semen_stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeTouro" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "notaFiscal" TEXT,
    "quantidadeTotal" INTEGER NOT NULL,
    "quantidadeDisponivel" INTEGER NOT NULL,
    "quantidadeUsada" INTEGER NOT NULL DEFAULT 0,
    "valorUnitario" REAL,
    "dataEntrada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataColeta" DATETIME,
    "dataVencimento" DATETIME,
    "posicao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISPONIVEL',
    "responsavel" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "containerId" TEXT NOT NULL,
    "canecaId" TEXT NOT NULL,
    CONSTRAINT "semen_stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "semen_stock_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "semen_containers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "semen_stock_canecaId_fkey" FOREIGN KEY ("canecaId") REFERENCES "semen_canecas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "semen_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsavel" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "motivo" TEXT,
    "destinatario" TEXT,
    "valorUnitario" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "semenStockId" TEXT,
    "containerOrigemId" TEXT,
    "containerDestinoId" TEXT,
    CONSTRAINT "semen_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "semen_movements_semenStockId_fkey" FOREIGN KEY ("semenStockId") REFERENCES "semen_stock" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "semen_movements_containerOrigemId_fkey" FOREIGN KEY ("containerOrigemId") REFERENCES "semen_containers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "semen_movements_containerDestinoId_fkey" FOREIGN KEY ("containerDestinoId") REFERENCES "semen_containers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "semen_containers_botijaoNumero_key" ON "semen_containers"("botijaoNumero");

-- CreateIndex
CREATE UNIQUE INDEX "semen_canecas_containerId_numero_key" ON "semen_canecas"("containerId", "numero");
