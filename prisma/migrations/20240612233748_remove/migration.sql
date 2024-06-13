/*
  Warnings:

  - You are about to drop the `Areas` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `areaId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `cancelationsId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cancelationsId]` on the table `CancelationRef` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `Cancelations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coffe_bar` to the `Event` table without a default value. This is not possible if the table is not empty.
  - The required column `eventId` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `room` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vip` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Areas";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cancelations" (
    "cancelationId" TEXT NOT NULL PRIMARY KEY,
    "mount_unity" TEXT NOT NULL,
    "mount_total" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Cancelations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cancelations" ("cancelationId", "description", "mount_total", "mount_unity") SELECT "cancelationId", "description", "mount_total", "mount_unity" FROM "Cancelations";
DROP TABLE "Cancelations";
ALTER TABLE "new_Cancelations" RENAME TO "Cancelations";
CREATE UNIQUE INDEX "Cancelations_eventId_key" ON "Cancelations"("eventId");
CREATE TABLE "new_Event" (
    "eventId" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_quantity_people" INTEGER NOT NULL,
    "event_character" TEXT NOT NULL,
    "event_intro" BOOLEAN NOT NULL,
    "event_cost" DECIMAL NOT NULL,
    "event_datetime_date" TEXT NOT NULL,
    "event_datetime_tiem_start" TEXT NOT NULL,
    "event_datetime_tiem_end" TEXT NOT NULL,
    "admin_date" TEXT NOT NULL,
    "admin_status" TEXT NOT NULL,
    "admin_code" TEXT NOT NULL,
    "admin_datetime_start" TEXT NOT NULL,
    "admin_datetime_end" TEXT NOT NULL,
    "admin_arancel" TEXT NOT NULL DEFAULT '',
    "admin_observation" TEXT NOT NULL DEFAULT '',
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    "coffe_bar" BOOLEAN NOT NULL,
    "room" BOOLEAN NOT NULL,
    "vip" BOOLEAN NOT NULL
);
INSERT INTO "new_Event" ("address", "admin_arancel", "admin_code", "admin_date", "admin_datetime_end", "admin_datetime_start", "admin_observation", "admin_status", "ci", "create_at", "delete_at", "email", "event_character", "event_cost", "event_datetime_date", "event_datetime_tiem_end", "event_datetime_tiem_start", "event_intro", "event_name", "event_quantity_people", "event_type", "fullname", "phone", "update_at") SELECT "address", "admin_arancel", "admin_code", "admin_date", "admin_datetime_end", "admin_datetime_start", "admin_observation", "admin_status", "ci", "create_at", "delete_at", "email", "event_character", "event_cost", "event_datetime_date", "event_datetime_tiem_end", "event_datetime_tiem_start", "event_intro", "event_name", "event_quantity_people", "event_type", "fullname", "phone", "update_at" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CancelationRef_cancelationsId_key" ON "CancelationRef"("cancelationsId");
