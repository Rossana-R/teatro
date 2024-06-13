-- CreateTable
CREATE TABLE "App" (
    "appId" TEXT NOT NULL PRIMARY KEY,
    "mount_total" REAL NOT NULL,
    "app_name" TEXT NOT NULL DEFAULT 'Fotocopia'
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" DATETIME,
    "createBy" TEXT,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "areaId" TEXT NOT NULL,
    "cancelationsId" TEXT NOT NULL,
    CONSTRAINT "Event_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Areas" ("areaId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_cancelationsId_fkey" FOREIGN KEY ("cancelationsId") REFERENCES "Cancelations" ("cancelationId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cancelations" (
    "cancelationId" TEXT NOT NULL PRIMARY KEY,
    "mount_unity" TEXT NOT NULL,
    "mount_total" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CancelationRef" (
    "cancelationRefId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "mount" TEXT NOT NULL,
    "percentage" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Areas" (
    "areaId" TEXT NOT NULL PRIMARY KEY,
    "coffe_bar" BOOLEAN NOT NULL,
    "room" BOOLEAN NOT NULL,
    "vip" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "concepto" TEXT NOT NULL,
    "mount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Transaction_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
