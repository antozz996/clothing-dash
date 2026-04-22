-- CreateTable
CREATE TABLE "contatori" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anno" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "ultimo_prog" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "clienti" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ragione_sociale" TEXT NOT NULL,
    "indirizzo" TEXT,
    "cap" TEXT,
    "citta" TEXT,
    "provincia" TEXT,
    "piva" TEXT,
    "cf" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "note" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "prodotti" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "prezzo_unitario" REAL NOT NULL,
    "taglie" TEXT NOT NULL,
    "colori" TEXT NOT NULL,
    "foto_url" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ordini" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressivo" INTEGER NOT NULL,
    "anno" INTEGER NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "data_ordine" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stato" TEXT NOT NULL DEFAULT 'bozza',
    "note" TEXT,
    "imponibile" REAL NOT NULL DEFAULT 0,
    "iva" REAL NOT NULL DEFAULT 0,
    "totale_ivato" REAL NOT NULL DEFAULT 0,
    "totale_capi" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ordini_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clienti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "righe_griglia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordine_id" TEXT NOT NULL,
    "prodotto_id" TEXT,
    "sku" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "prezzo_unitario" REAL NOT NULL,
    "foto_url" TEXT,
    "colore" TEXT NOT NULL,
    "taglia" TEXT NOT NULL,
    "quantita" INTEGER NOT NULL DEFAULT 0,
    "importo_riga" REAL NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "righe_griglia_ordine_id_fkey" FOREIGN KEY ("ordine_id") REFERENCES "ordini" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "righe_griglia_prodotto_id_fkey" FOREIGN KEY ("prodotto_id") REFERENCES "prodotti" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ddt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressivo" INTEGER NOT NULL,
    "anno" INTEGER NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "ordine_id" TEXT,
    "cliente_id" TEXT NOT NULL,
    "data_ddt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mittente_nome" TEXT,
    "mittente_indirizzo" TEXT,
    "dest_nome" TEXT,
    "dest_indirizzo" TEXT,
    "dest_cap" TEXT,
    "dest_citta" TEXT,
    "dest_provincia" TEXT,
    "dest_diversa" BOOLEAN NOT NULL DEFAULT false,
    "dest_div_nome" TEXT,
    "dest_div_indirizzo" TEXT,
    "dest_div_cap" TEXT,
    "dest_div_citta" TEXT,
    "dest_div_provincia" TEXT,
    "condizioni_pagamento" TEXT,
    "banca_appoggio" TEXT,
    "agente" TEXT,
    "note" TEXT,
    "data_consegna_prevista" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ddt_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clienti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ddt_ordine_id_fkey" FOREIGN KEY ("ordine_id") REFERENCES "ordini" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "righe_ddt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ddt_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "foto_url" TEXT,
    "colore" TEXT NOT NULL,
    "taglia" TEXT NOT NULL,
    "quantita" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "righe_ddt_ddt_id_fkey" FOREIGN KEY ("ddt_id") REFERENCES "ddt" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "contatori_anno_tipo_key" ON "contatori"("anno", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "prodotti_sku_key" ON "prodotti"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ordini_numero_documento_key" ON "ordini"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "ordini_progressivo_anno_key" ON "ordini"("progressivo", "anno");

-- CreateIndex
CREATE UNIQUE INDEX "ddt_numero_documento_key" ON "ddt"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "ddt_progressivo_anno_key" ON "ddt"("progressivo", "anno");
