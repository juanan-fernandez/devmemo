-- CreateIndex
CREATE INDEX "Collection_userId_createdAt_idx" ON "Collection"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Item_userId_createdAt_idx" ON "Item"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Item_userId_isPinned_createdAt_idx" ON "Item"("userId", "isPinned", "createdAt");

-- CreateIndex
CREATE INDEX "Item_userId_isFavorite_idx" ON "Item"("userId", "isFavorite");
