-- CreateTable
CREATE TABLE "StaticticsForYear" (
    "staticticsForYearId" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month1" TEXT NOT NULL DEFAULT '1_enero',
    "month2" TEXT NOT NULL DEFAULT '2_febrero',
    "month3" TEXT NOT NULL DEFAULT '3_marzo',
    "month4" TEXT NOT NULL DEFAULT '4_abril',
    "month5" TEXT NOT NULL DEFAULT '5_mayo',
    "month6" TEXT NOT NULL DEFAULT '6_junio',
    "month7" TEXT NOT NULL DEFAULT '7_julio',
    "month8" TEXT NOT NULL DEFAULT '8_agosto',
    "month9" TEXT NOT NULL DEFAULT '9_septiembre',
    "month10" TEXT NOT NULL DEFAULT '10_octubre',
    "month11" TEXT NOT NULL DEFAULT '11_noviembre',
    "month12" TEXT NOT NULL DEFAULT '12_diciembre',
    "enero" INTEGER NOT NULL DEFAULT 0,
    "febrero" INTEGER NOT NULL DEFAULT 0,
    "marzo" INTEGER NOT NULL DEFAULT 0,
    "abril" INTEGER NOT NULL DEFAULT 0,
    "mayo" INTEGER NOT NULL DEFAULT 0,
    "junio" INTEGER NOT NULL DEFAULT 0,
    "julio" INTEGER NOT NULL DEFAULT 0,
    "agosto" INTEGER NOT NULL DEFAULT 0,
    "septiembre" INTEGER NOT NULL DEFAULT 0,
    "octubre" INTEGER NOT NULL DEFAULT 0,
    "noviembre" INTEGER NOT NULL DEFAULT 0,
    "diciembre" INTEGER NOT NULL DEFAULT 0
);
