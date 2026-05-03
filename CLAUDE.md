@AGENTS.md

# VelocityVista — Internal Sales Dashboard

## Stack

Next.js (App Router), TypeScript, Supabase, Tailwind CSS, Recharts, Zod, clsx, react-icons

## Database Schema

### profiles

- id (references auth.users)
- full_name, job_title, role (rep/admin/coo)
- division_id (FK → divisions)
- email, avatar_url, created_at

### divisions

- id, name, created_by (FK → profiles), created_at

### sales

- id, rep_id (FK → profiles), division_id (FK → divisions)
- amount, description, status (secured/lost)
- closing_date, created_at

## Roles

- Rep: own sales only
- Admin: division-scoped, can remove reps
- COO: full access, can remove admins, create divisions

## Pages

- /auth/signup — email, password, full name, job title, role, division
- /auth/signin
- /dashboard — 4 stat cards (Secured, Lost, Total, Performance Score), line chart: deal count, weekly (this week vs last week) / monthly (this month vs last month) toggle, Log Sale modal
- /team — card grid, division-scoped (COO sees all), card shows pic/name/title/division/email, top 5 get special card styling (1st/2nd/3rd individual, 4th-5th shared)
- /leaderboard — bar chart by secured deal amount, profile pic above bars, rep sees own position, admin sees worst performers, COO sees division-level then can drill into rep-level, division-level bar chart, this month vs last month toggle, filter by division or view all, paginated
- /admin — search by UUID, table with pagination, division select (COO only), role select, remove button, COO can create divisions
- /settings — profile pic upload only

## Key Rules

- RLS handles all data scoping at DB level
- Zod on all forms and API routes
- Realtime on sales table
- Desktop only, no mobile responsiveness needed
