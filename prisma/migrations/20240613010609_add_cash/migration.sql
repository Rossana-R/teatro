/*
  Warnings:

  - Added the required column `isCash` to the `CancelationRef` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CancelationRef" (
    "cancelationRefId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "mount" TEXT NOT NULL,
    "percentage" TEXT NOT NULL,
    "isCash" BOOLEAN NOT NULL,
    "cancelationsId" TEXT NOT NULL,
    CONSTRAINT "CancelationRef_cancelationsId_fkey" FOREIGN KEY ("cancelationsId") REFERENCES "Cancelations" ("cancelationId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CancelationRef" ("cancelationRefId", "cancelationsId", "code", "date", "mount", "percentage") SELECT "cancelationRefId", "cancelationsId", "code", "date", "mount", "percentage" FROM "CancelationRef";
DROP TABLE "CancelationRef";
ALTER TABLE "new_CancelationRef" RENAME TO "CancelationRef";
CREATE UNIQUE INDEX "CancelationRef_cancelationsId_key" ON "CancelationRef"("cancelationsId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
