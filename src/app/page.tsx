import { connection } from "next/server";
import { GroceryApp } from "@/components/GroceryApp";
import { listItems } from "@/lib/items-service";

export default async function Home() {
  await connection(); // always read fresh data from the database
  const items = await listItems();
  return <GroceryApp initialItems={items} />;
}