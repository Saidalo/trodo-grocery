import type { ItemRow } from "@/db/schema";

// What the API sends to the browser: dates become ISO strings in JSON.
export type Item = Omit<ItemRow, "createdAt"> & { createdAt: string };

export const toItem = (row: ItemRow): Item => ({ ...row, createdAt: row.createdAt.toISOString() });