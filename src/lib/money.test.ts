import { describe, expect, it } from "vitest";
import { pendingTotalCents, toCents } from "./money";

describe("money", () => {
    it("converts euros to cents without float errors", () => {
        expect(toCents(0.1 + 0.2)).toBe(30);
        expect(toCents(19.99)).toBe(1999);
    });

    it("sums only items that are not done", () => {
        const items = [
            { priceCents: 100, done: false },
            { priceCents: 250, done: true },
            { priceCents: 50, done: false },
        ];
        expect(pendingTotalCents(items)).toBe(150);
    });
});