-- CreateTable
CREATE TABLE "Tin" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Tin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quoc" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Quoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TinQuoc" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TinQuoc_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TinQuoc_B_index" ON "_TinQuoc"("B");

-- AddForeignKey
ALTER TABLE "_TinQuoc" ADD CONSTRAINT "_TinQuoc_A_fkey" FOREIGN KEY ("A") REFERENCES "Quoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TinQuoc" ADD CONSTRAINT "_TinQuoc_B_fkey" FOREIGN KEY ("B") REFERENCES "Tin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
