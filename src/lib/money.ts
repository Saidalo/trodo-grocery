const formatter = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export const toCents = (euros: number) => Math.round(euros * 100);

export const formatPrice = (cents: number) => formatter.format(cents / 100);

export const pendingTotalCents = (list: { priceCents: number; done: boolean }[]) =>
    list.filter((item) => !item.done).reduce((sum, item) => sum + item.priceCents, 0);