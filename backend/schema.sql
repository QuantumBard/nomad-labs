-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('TRAVELLER', 'MANAGER', 'ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('ACTIVE', 'TRIGGERED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "photoUrl" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'TRAVELLER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_reminders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "source_code" TEXT,
    "destination_code" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "target_price" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION,
    "average_price" DOUBLE PRECISION,
    "status" "ReminderStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_triggered" BOOLEAN NOT NULL DEFAULT false,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fare_history" (
    "id" TEXT NOT NULL,
    "reminder_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "airline" TEXT,
    "flight_number" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fare_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_searches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "source_code" TEXT,
    "destination_code" TEXT,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "adults" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "search_params" JSONB,
    "results_count" INTEGER,
    "average_price" DOUBLE PRECISION,
    "min_price" DOUBLE PRECISION,
    "max_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flight_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION,
    "discount_percent" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notification_channels" JSONB,
    "last_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'amadeus',
    "requests_count" INTEGER NOT NULL DEFAULT 1,
    "response_time_ms" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "flight_reminders_user_id_idx" ON "flight_reminders"("user_id");

-- CreateIndex
CREATE INDEX "flight_reminders_status_idx" ON "flight_reminders"("status");

-- CreateIndex
CREATE INDEX "flight_reminders_source_destination_idx" ON "flight_reminders"("source", "destination");

-- CreateIndex
CREATE INDEX "fare_history_reminder_id_idx" ON "fare_history"("reminder_id");

-- CreateIndex
CREATE INDEX "fare_history_recorded_at_idx" ON "fare_history"("recorded_at");

-- CreateIndex
CREATE INDEX "flight_searches_user_id_idx" ON "flight_searches"("user_id");

-- CreateIndex
CREATE INDEX "flight_searches_created_at_idx" ON "flight_searches"("created_at");

-- CreateIndex
CREATE INDEX "price_alerts_user_id_idx" ON "price_alerts"("user_id");

-- CreateIndex
CREATE INDEX "price_alerts_is_active_idx" ON "price_alerts"("is_active");

-- CreateIndex
CREATE INDEX "api_usage_created_at_idx" ON "api_usage"("created_at");

-- CreateIndex
CREATE INDEX "api_usage_provider_idx" ON "api_usage"("provider");

-- AddForeignKey
ALTER TABLE "flight_reminders" ADD CONSTRAINT "flight_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fare_history" ADD CONSTRAINT "fare_history_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "flight_reminders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_searches" ADD CONSTRAINT "flight_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

