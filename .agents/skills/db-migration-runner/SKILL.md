---
name: db-migration-runner
description: Use this skill whenever creating, modifying, or running a Supabase database migration for Styled by Uriel — new tables, columns, indexes, or Row Level Security policies. Ensures every schema change is versioned, reviewed, and ships with the correct RLS policy rather than being applied ad hoc against the database. Trigger on requests like "add a column for...", "create a table for...", "write an RLS policy for...", "run the migration".
---

# DB Migration Runner

Use this skill for any change to the Supabase schema. Follow `.agents/rules/architecture.md` (for what the schema should look like) and `.agents/rules/security.md` (for RLS requirements) alongside this skill — this is the authoritative *process* guide, those are the authoritative *rules*.

## Step 1 — Never Edit the Schema by Hand

All schema changes go through a migration file under `/supabase/migrations/` — never make a change directly in the Supabase dashboard's table editor for anything beyond local experimentation. If a change was made in the dashboard during exploration, it must still be captured as a migration before being considered done.

## Step 2 — Create the Migration

```bash
supabase migration new <descriptive_name>
# e.g. supabase migration new create_products_table
# e.g. supabase migration new add_stock_quantity_to_products
```

This creates a timestamped SQL file under `/supabase/migrations/`. Naming: `snake_case`, verb-first, describing the change — not `update1` or `fix`.

## Step 3 — Write the Migration

Every migration that creates or alters a table must, in the same file:
1. Define/alter the table with explicit column types and constraints (`NOT NULL` where the PRD data model implies a required field)
2. Add appropriate indexes (e.g. on `category_id`, `slug`, foreign keys used in lookups)
3. **Enable RLS** on any new table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) — no table ships without this
4. Add the RLS policies for that table, matching the baseline in `security.md` (public read of published catalog data, vendor-only writes; orders are write-restricted, not publicly readable)

```sql
-- Example: products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references categories(id),
  availability boolean not null default true,
  stock_quantity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Public can read available products"
  on products for select
  using (availability = true);

create policy "Vendors can manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

Adjust the vendor policy to a specific role/claim check if the project introduces more than one vendor account and needs to scope by owner — don't leave it as a blanket "any authenticated user" check if that stops matching reality.

## Step 4 — Match the PRD Data Model

Cross-check new/changed columns against the PRD's data model (§9/§14) before writing the migration. Don't add speculative columns "in case they're needed" — if a field isn't in the PRD and isn't required by an approved feature, leave it out (see `AGENT.md` rule 8, don't build ahead of scope).

## Step 5 — Run Locally First

```bash
supabase start          # local Postgres + Studio, if not already running
supabase db reset       # replays all migrations against a clean local DB — catches ordering/syntax issues
```

Verify the change against local Supabase Studio before applying anywhere else — check the table shape, confirm RLS policies exist and behave as expected (try a query as an anon role vs. authenticated role).

## Step 6 — Apply to Remote

```bash
supabase link --project-ref <project-ref>   # once per environment, if not already linked
supabase db push                            # applies pending local migrations to the linked remote project
```

Apply to a staging/dev Supabase project first if one exists, before production. Never hand-edit the remote schema to "match" a migration that failed — fix the migration and re-run.

## Step 7 — Never Edit an Applied Migration

Once a migration has been applied anywhere beyond your own local machine, don't edit its file — write a new migration that alters the schema further. Editing history breaks migration replay for anyone else (or any other environment) that already applied the original.

## Checklist Before Considering a Schema Change Done

- [ ] Change matches the PRD's data model — no speculative fields
- [ ] RLS is enabled on any new table
- [ ] RLS policies match `security.md`'s baseline (public read of published catalog data only; vendor-only writes; orders not publicly readable)
- [ ] Ran locally (`supabase db reset`) and verified in Studio before pushing
- [ ] TypeScript types in `/types` regenerated/updated to match (e.g. via `supabase gen types typescript`) so the app doesn't drift out of sync with the schema
