-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderemail" TEXT NOT NULL,
    "receivermail" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
