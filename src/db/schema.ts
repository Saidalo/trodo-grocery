import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    date,
    integer,
    pgEnum,
    pgTable,
    real,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const itemType = pgEnum("item_type", ["REGULAR", "PERISHABLE", "CONSUMER"]);

export const items = pgTable(
    "items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        priceCents: integer("price_cents").notNull(),
        type: itemType("type").notNull().default("REGULAR"),
        done: boolean("done").notNull().default(false),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        // Perishable goods
        expirationDate: date("expiration_date"),
        keepInTemperature: real("keep_in_temperature"),
        // Consumer goods
        pictureUrl: text("picture_url"),
    },
    (t) => [
        check("price_not_negative", sql`${t.priceCents} >= 0`),
        check(
            "perishable_has_expiration",
            sql`${t.type} <> 'PERISHABLE' OR ${t.expirationDate} IS NOT NULL`,
        ),
    ],
);

export type ItemRow = typeof items.$inferSelect;
export type ItemType = (typeof itemType.enumValues)[number];