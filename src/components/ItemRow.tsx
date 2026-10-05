"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/money";
import type { Item } from "@/lib/types";

const TYPE_LABELS = { REGULAR: "Regular", PERISHABLE: "Perishable", CONSUMER: "Consumer" };

const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

type Props = { item: Item; onToggle: () => void; onDelete: () => void };

export function ItemRow({ item, onToggle, onDelete }: Props) {
    const [imageFailed, setImageFailed] = useState(false);
    const today = new Date().toISOString().slice(0, 10);
    const expired = item.expirationDate !== null && item.expirationDate < today;

    return (
        <li className="flex items-center gap-3 rounded-lg border border-gray-300 p-3">
            <input
                type="checkbox"
                checked={item.done}
                onChange={onToggle}
                aria-label={`Mark ${item.name} as done`}
                className="h-5 w-5"
            />

            {item.pictureUrl && !imageFailed && (
                // eslint-disable-next-line @next/next/no-img-element -- any user-supplied host
                <img
                    src={item.pictureUrl}
                    alt={item.name}
                    onError={() => setImageFailed(true)}
                    className="h-12 w-12 rounded object-cover"
                />
            )}

            <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                    <span className={item.done ? "text-gray-400 line-through" : "font-medium"}>
                        {item.name}
                    </span>
                    {item.type !== "REGULAR" && (
                        <span className="rounded bg-gray-200 px-2 text-xs text-gray-700">
                            {TYPE_LABELS[item.type]}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-x-3 text-sm text-gray-500">
                    <time dateTime={item.createdAt} suppressHydrationWarning>
                        Added {dateTimeFormat.format(new Date(item.createdAt))}
                    </time>
                    {item.expirationDate && (
                        <span className={expired ? "font-semibold text-red-600" : undefined}>
                            {expired ? "Expired" : "Expires"} {item.expirationDate}
                        </span>
                    )}
                    {item.keepInTemperature !== null && <span>Keep at {item.keepInTemperature}°C</span>}
                </div>
            </div>

            <span className="font-semibold">{formatPrice(item.priceCents)}</span>

            <button
                onClick={onDelete}
                aria-label={`Remove ${item.name}`}
                className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
            >
                ✕
            </button>
        </li>
    );
}