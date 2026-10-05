# Grocery List

A simple grocery list app built for the Trodo JavaScript assignment.

**Live demo:** https://trodo-grocery-iyvp8tgny-test-academy1.vercel.app

Add items with a name and price, mark them as done, hide completed items, see the total of pending items, and add special item types:

- **Perishable goods:** expiration date (required) and keep-in temperature (optional)
- **Consumer goods:** picture URL (optional, shown as an image)

Data is stored in PostgreSQL, so nothing is lost when the server restarts.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| API | REST route handlers (`/api/items`) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod, shared by the form and the API |
| Styling | Tailwind CSS |
| Tests | Vitest (unit) + Playwright (end-to-end) |
| Hosting | Vercel (app) + Aiven (PostgreSQL) |

## Running locally

### Prerequisites

- Node.js 22 or newer (`node -v`)
- Docker Desktop (running)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/Saidalo/trodo-grocery.git
cd trodo-grocery
npm install

# 2. Configure the database connection
cp .env.example .env

# 3. Start PostgreSQL in Docker
docker compose up -d

# 4. Create the database table
npm run db:migrate

# 5. Start the app
npm run dev
```

Open http://localhost:3000.

The default `.env` points to the local Docker database:

```text
DATABASE_URL=postgres://grocery:grocery@localhost:5432/grocery
```

To stop the database, run `docker compose down`. Your data is kept in a Docker volume. Use `docker compose down -v` to delete it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit tests (validation, price math) |
| `npm run test:e2e` | Browser test of the full user flow (run `npx playwright install chromium` once first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Create a new migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to the database in `DATABASE_URL` |

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/items` | List all items, newest first |
| POST | `/api/items` | Create an item |
| PATCH | `/api/items/:id` | Mark an item done or not done (`{ "done": true }`) |
| DELETE | `/api/items/:id` | Remove an item |

Example:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"type":"PERISHABLE","name":"Yogurt","price":2.49,"expirationDate":"2026-12-31","keepInTemperature":4}'
```

Invalid input returns `400` with a message per field. An unknown id returns `404`.

## Project structure

```text
src/
├── app/
│   ├── page.tsx              # Root route: loads items on the server
│   └── api/items/            # REST endpoints
├── components/               # GroceryApp, ItemForm, ItemRow
├── db/                       # Drizzle schema and connection
└── lib/                      # Validation, price helpers, data access
drizzle/                      # SQL migrations
e2e/                          # Playwright test
```

## Design decisions

- **One `items` table with a `type` column.** Type-specific fields are nullable. A Zod discriminated union checks which fields each type needs, and a database check constraint makes sure perishables always have an expiration date.
- **Prices are stored as whole cents** (integers) to avoid floating-point rounding errors.
- **The pending total** counts every item that isn't done, whether or not completed items are hidden.
- **Instant UI updates:** marking items done and deleting them update the screen immediately and roll back if the server request fails.
- **Expired perishables** are shown in red.
- **Broken image URLs** are hidden instead of showing a broken image, and only `http(s)` URLs are accepted.

## With more time

- Edit existing items
- Sorting (by date, price or expiration)
- User accounts, so each person has their own list
