"use client";

import { useState } from "react";
import type { ItemType } from "@/db/schema";
import type { Item } from "@/lib/types";
import { createItemSchema, fieldErrors } from "@/lib/validation";

const emptyForm = {
    name: "",
    price: "",
    type: "REGULAR" as ItemType,
    expirationDate: "",
    keepInTemperature: "",
    pictureUrl: "",
};

const optionalNumber = (value: string) => (value.trim() === "" ? undefined : Number(value));
const optionalText = (value: string) => (value.trim() === "" ? undefined : value.trim());

export function ItemForm({ onCreated }: { onCreated: (item: Item) => void }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const set = (field: keyof typeof emptyForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((f) => ({ ...f, [field]: e.target.value }));

    // Only send the fields that belong to the chosen type.
    function buildPayload() {
        const base = { name: form.name, price: optionalNumber(form.price) };
        if (form.type === "PERISHABLE") {
            return {
                ...base,
                type: form.type,
                expirationDate: optionalText(form.expirationDate),
                keepInTemperature: optionalNumber(form.keepInTemperature),
            };
        }
        if (form.type === "CONSUMER") {
            return { ...base, type: form.type, pictureUrl: optionalText(form.pictureUrl) };
        }
        return { ...base, type: form.type };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const parsed = createItemSchema.safeParse(buildPayload());
        if (!parsed.success) {
            setErrors(fieldErrors(parsed.error));
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors(data.errors ?? { form: "Could not save the item" });
                return;
            }
            onCreated(data);
            setForm(emptyForm);
            setErrors({});
        } catch {
            setErrors({ form: "Network error, please try again" });
        } finally {
            setSaving(false);
        }
    }

    const inputClass = "w-full rounded border border-gray-300 bg-transparent px-3 py-2";

    return (
        <form onSubmit={handleSubmit} noValidate className="grid gap-3 rounded-lg border border-gray-300 p-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={set("name")} className={inputClass} />
            </Field>

            <Field label="Price (€)" error={errors.price}>
                <input type="number" step="0.01" min="0" value={form.price} onChange={set("price")} className={inputClass} />
            </Field>

            <Field label="Type" error={errors.type}>
                <select value={form.type} onChange={set("type")} className={inputClass}>
                    <option value="REGULAR">Regular</option>
                    <option value="PERISHABLE">Perishable</option>
                    <option value="CONSUMER">Consumer goods</option>
                </select>
            </Field>

            {form.type === "PERISHABLE" && (
                <>
                    <Field label="Expiration date" error={errors.expirationDate}>
                        <input type="date" value={form.expirationDate} onChange={set("expirationDate")} className={inputClass} />
                    </Field>
                    <Field label="Keep-in temperature (°C, optional)" error={errors.keepInTemperature}>
                        <input type="number" step="0.5" value={form.keepInTemperature} onChange={set("keepInTemperature")} className={inputClass} />
                    </Field>
                </>
            )}

            {form.type === "CONSUMER" && (
                <Field label="Picture URL (optional)" error={errors.pictureUrl}>
                    <input type="url" value={form.pictureUrl} onChange={set("pictureUrl")} className={inputClass} placeholder="https://…" />
                </Field>
            )}

            {errors.form && <p className="text-sm text-red-600 sm:col-span-2">{errors.form}</p>}

            <button
                type="submit"
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-2"
            >
                {saving ? "Adding…" : "Add item"}
            </button>
        </form>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{label}</span>
            {children}
            {error && <span className="text-red-600">{error}</span>}
        </label>
    );
}