-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'MEDIA',
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataLida" DATETIME,
    "dataResolvida" DATETIME,
    "dataAgendada" DATETIME,
    "dados" TEXT,
    "userId" TEXT NOT NULL,
    "gtaId" TEXT,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notifications_gtaId_fkey" FOREIGN KEY ("gtaId") REFERENCES "gtas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
