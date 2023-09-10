/*
  Warnings:

  - Changed the type of `cpf` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cnpj` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf",
ADD COLUMN     "cpf" INTEGER NOT NULL,
DROP COLUMN "cnpj",
ADD COLUMN     "cnpj" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_id_cpf_key" ON "User"("email", "id", "cpf");
