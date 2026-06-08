# VelocityVista

A role-based sales intelligence dashboard built with Next.js 16 App Router and Supabase. Live at [velocityvista.vercel.app](https://velocityvista.vercel.app).

---

## Stack

Next.js 16 · React 19 · TypeScript · Supabase (Auth, PostgreSQL, Storage) · Tailwind v4 · Recharts · Resend · Zod · react-hook-form

---

## Architecture decisions

**Server components by default.** All data fetching happens at the page level in server components and is passed down as props. There is no client-side data fetching — no `useEffect`, no loading states for initial data. Client components own UI state only.

**Server actions for mutations.** Every form submission goes through a typed server action. Zod validates the payload before any database call. `react-hook-form` handles client-side validation; `useActionState` handles the server response — connected via `startTransition` so the UI stays responsive during the action.

**Middleware-level route protection.** Route guards live in `src/proxy.ts`, not in page components. The middleware checks the session and role on every request and redirects before the page ever renders. Role is always read from `user.user_metadata` — never the database — to avoid an extra round trip on every navigation.

**Separate Supabase clients.** The regular client uses the anon key and respects RLS. A separate admin client in `src/lib/supabase/admin.ts` uses the service role key, scoped only to operations that require it (user deletion). The two are never mixed.

**RLS as the enforcement layer.** Row-level security policies on the database handle data scoping — the application layer reflects that scoping, it doesn't duplicate it.

---

## Role system

Three roles: `coo`, `admin`, `rep`. The role drives routing, data scoping, and UI visibility.

| Role | Routing | Data scope |
|------|---------|------------|
| `coo` | `/dashboard/admin` | All divisions |
| `admin` | `/dashboard/admin` | Own division only |
| `rep` | `/dashboard` | Own division only |

COOs can create divisions, send signup tokens, and terminate any non-COO user. Admins can terminate reps within their division. Reps have no admin access.

---

## Token-gated signup

Sign up is not publicly accessible. A COO sends a signup token via email (Resend). The middleware validates the token against the `invites` table — checking existence and expiry — before the signup page loads. Invalid or expired tokens redirect to sign in. Tokens expire after 24 hours.

---

## Data aggregation

Sales data is aggregated at the database level using PostgREST's aggregation support (`pgrst.db_aggregates_enabled`). The leaderboard and team pages receive pre-summed revenue figures from a single query — no aggregation in JavaScript.

Weekly performance metrics use calendar Monday–Sunday boundaries, not rolling 7-day windows, via a shared `weeklyCalc` utility consumed by the dashboard, stats, and glance bar components.

---

## Running locally

```bash
npm install
npm run dev
```

`.env.local` requires:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Seeding** (requires grants below):

```bash
# Creates users across all divisions via the Supabase Admin API (handles auth correctly)
npm run seed:users

# Generates sales records per rep — current week, last week, and last month
npm run seed:sales
```

```sql
GRANT SELECT ON public.profiles TO service_role;
GRANT INSERT ON public.sales TO service_role;
```
