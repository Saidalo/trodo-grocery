import { z } from "zod";

const baseFields = {
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    price: z
        .number({ error: "Price must be a number" })
        .nonnegative("Price can't be negative")
        .max(100_000, "Price is too high"),
};

export const createItemSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("REGULAR"), ...baseFields }),
    z.object({
        type: z.literal("PERISHABLE"),
        ...baseFields,
        expirationDate: z.iso.date({ error: "Expiration date is required" }),
        keepInTemperature: z
            .number({ error: "Temperature must be a number" })
            .min(-50, "Too cold")
            .max(50, "Too warm")
            .optional(),
    }),
    z.object({
        type: z.literal("CONSUMER"),
        ...baseFields,
        pictureUrl: z.url({ protocol: /^https?$/, error: "Must be a valid http(s) URL" }).optional(),
    }),
]);

export const updateItemSchema = z.object({ done: z.boolean() });

export const itemIdSchema = z.uuid();

export type CreateItemInput = z.infer<typeof createItemSchema>;

/** Turns a ZodError into { fieldName: "first message" } for the form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
    const out: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = String(issue.path[0] ?? "form");
        out[key] ??= issue.message;
    }
    return out;
}