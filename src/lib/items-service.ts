import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { toCents } from "./money";
import { toItem } from "./types";
import type { CreateItemInput } from "./validation";

export async function listItems() {
    const rows = await db.select().from(items).orderBy(desc(items.createdAt));
    return rows.map(toItem);
}

export async function createItem(input: CreateItemInput) {
    const [row] = await db
        .insert(items)
        .values({
            name: input.name,
            priceCents: toCents(input.price),
            type: input.type,
            expirationDate: input.type === "PERISHABLE" ? input.expirationDate : null,
            keepInTemperature: input.type === "PERISHABLE" ? (input.keepInTemperature ?? null) : null,
            pictureUrl: input.type === "CONSUMER" ? (input.pictureUrl ?? null) : null,
        })
        .returning();
    return toItem(row);
}

export async function setItemDone(id: string, done: boolean) {
    const [row] = await db.update(items).set({ done }).where(eq(items.id, id)).returning();
    return row ? toItem(row) : null;
}

export async function deleteItem(id: string) {
    const deleted = await db.delete(items).where(eq(items.id, id)).returning({ id: items.id });
    return deleted.length > 0;
}