import { createItem, listItems } from "@/lib/items-service";
import { createItemSchema, fieldErrors } from "@/lib/validation";

export async function GET() {
    return Response.json(await listItems());
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
    }
    return Response.json(await createItem(parsed.data), { status: 201 });
}