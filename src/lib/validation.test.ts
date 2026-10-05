import { describe, expect, it } from "vitest";
import { createItemSchema } from "./validation";

describe("createItemSchema", () => {
    it("accepts a regular item", () => {
        const result = createItemSchema.safeParse({ type: "REGULAR", name: " Milk ", price: 1.29 });
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("Milk");
    });

    it("rejects an empty name and a negative price", () => {
        const result = createItemSchema.safeParse({ type: "REGULAR", name: "", price: -1 });
        expect(result.success).toBe(false);
    });

    it("requires an expiration date for perishables", () => {
        const result = createItemSchema.safeParse({ type: "PERISHABLE", name: "Yogurt", price: 2 });
        expect(result.success).toBe(false);
    });

    it("accepts a perishable with an optional temperature", () => {
        const result = createItemSchema.safeParse({
            type: "PERISHABLE",
            name: "Yogurt",
            price: 2,
            expirationDate: "2026-12-31",
            keepInTemperature: 4,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-http picture URL for consumer goods", () => {
        const result = createItemSchema.safeParse({
            type: "CONSUMER",
            name: "Soap",
            price: 3,
            pictureUrl: "javascript:alert(1)",
        });
        expect(result.success).toBe(false);
    });

    it("drops fields that belong to another type", () => {
        const result = createItemSchema.safeParse({
            type: "REGULAR",
            name: "Bread",
            price: 2,
            pictureUrl: "https://example.com/bread.jpg",
        });
        expect(result.data).not.toHaveProperty("pictureUrl");
    });
});