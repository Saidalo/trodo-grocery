"use client";

import { useState } from "react";
import { formatPrice, pendingTotalCents } from "@/lib/money";
import type { Item } from "@/lib/types";
import { ItemForm } from "./ItemForm";
import { ItemRow } from "./ItemRow";

export function GroceryApp({ initialItems }: { initialItems: Item[] }) {
    const [items, setItems] = useState(initialItems);
    const [hideDone, setHideDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log('aadslsadjlsadkjlskjda')
    const visible = hideDone ? items.filter((item) => !item.done) : items;

    async function toggleDone(item: Item) {
        const done = !item.done;
        setItems((list) => list.map((i) => (i.id === item.id ? { ...i, done } : i)));
        const res = await fetch(`/api/items/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done }),
        });
        if (!res.ok) {
            setItems((list) => list.map((i) => (i.id === item.id ? item : i)));
            setError("Could not update the item. Please try again.");
        }
    }

    async function remove(item: Item) {
        const previous = items;
        setItems((list) => list.filter((i) => i.id !== item.id));
        const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
        if (!res.ok) {
            setItems(previous);
            setError("Could not delete the item. Please try again.");
        }
    }

    return (
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-8">
            <h1 className="text-3xl font-bold">Grocery list</h1>

            <ItemForm onCreated={(item) => setItems((list) => [item, ...list])} />

            {error && (
                <p role="alert" className="rounded bg-red-100 p-3 text-red-800">
                    {error}{" "}
                    <button className="underline" onClick={() => setError(null)}>
                        Dismiss
                    </button>
                </p>
            )}

            <section className="flex flex-col gap-3">
                <label className="flex items-center gap-2 self-end text-sm">
                    <input
                        type="checkbox"
                        checked={hideDone}
                        onChange={(e) => setHideDone(e.target.checked)}
                    />
                    Hide completed
                </label>

                {visible.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                        {items.length === 0 ? "Your list is empty. Add your first item above." : "All done!"}
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {visible.map((item) => (
                            <ItemRow
                                key={item.id}
                                item={item}
                                onToggle={() => toggleDone(item)}
                                onDelete={() => remove(item)}
                            />
                        ))}
                    </ul>
                )}
            </section>

            <footer className="sticky bottom-0 mt-auto flex justify-between border-t border-gray-300 bg-background py-4 text-lg font-semibold">
                <span>Total pending</span>
                <span data-testid="pending-total">{formatPrice(pendingTotalCents(items))}</span>
            </footer>
        </main>
    );
}