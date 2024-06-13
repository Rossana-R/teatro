/*
  Warnings:

  - You are about to drop the column `isCash` on the `CancelationRef` table. All the data in the column will be lost.
  - Added the required column `isCash` to the `Cancelations` table without a default value. This is not possible if the table is not empty.

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
    "cancelationsId" TEXT NOT NULL,
    CONSTRAINT "CancelationRef_cancelationsId_fkey" FOREIGN KEY ("cancelationsId") REFERENCES "Cancelations" ("cancelationId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CancelationRef" ("cancelationRefId", "cancelationsId", "code", "date", "mount", "percentage") SELECT "cancelationRefId", "cancelationsId", "code", "date", "mount", "percentage" FROM "CancelationRef";
DROP TABLE "CancelationRef";
ALTER TABLE "new_CancelationRef" RENAME TO "CancelationRef";
CREATE UNIQUE INDEX "CancelationRef_cancelationsId_key" ON "CancelationRef"("cancelationsId");
CREATE TABLE "new_Cancelations" (
    "cancelationId" TEXT NOT NULL PRIMARY KEY,
    "mount_unity" TEXT NOT NULL,
    "mount_total" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isCash" BOOLEAN NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Cancelations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cancelations" ("cancelationId", "description", "eventId", "mount_total", "mount_unity") SELECT "cancelationId", "description", "eventId", "mount_total", "mount_unity" FROM "Cancelations";
DROP TABLE "Cancelations";
ALTER TABLE "new_Cancelations" RENAME TO "Cancelations";
CREATE UNIQUE INDEX "Cancelations_eventId_key" ON "Cancelations"("eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
