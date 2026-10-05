import { deleteItem, setItemDone } from "@/lib/items-service";
import { fieldErrors, itemIdSchema, updateItemSchema } from "@/lib/validation";

const notFound = () => Response.json({ error: "Item not found" }, { status: 404 });

export async function PATCH(request: Request, ctx: RouteContext<"/api/items/[id]">) {
    const { id } = await ctx.params;
    if (!itemIdSchema.safeParse(id).success) return notFound();

    const body = await request.json().catch(() => null);
    const parsed = updateItemSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
    }

    const item = await setItemDone(id, parsed.data.done);
    return item ? Response.json(item) : notFound();
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/items/[id]">) {
    const { id } = await ctx.params;
    if (!itemIdSchema.safeParse(id).success) return notFound();

    return (await deleteItem(id)) ? new Response(null, { status: 204 }) : notFound();
}