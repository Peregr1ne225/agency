# AGENTS.md

Welcome to the **Agency** project! This document serves as the guide for AI agents and developers working within this codebase.

---

## 1. Project Overview

- **Type**: Web Application
- **Core Framework**: React 19 (TypeScript) + Vite 8
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Backend / Database**: Supabase (`@supabase/supabase-js`)
- **Routing**: React Router (`react-router-dom` v7)
- **Linter**: Oxlint

---

## 2. Directory & Architecture Map

```
agency/
├── .env                  # Environment variables (Vite Supabase keys) - Git ignored
├── .gitignore            # Git ignore configuration (.env, node_modules, dist)
├── index.html            # Main HTML document
├── package.json          # Project dependencies and scripts
├── tsconfig*.json        # TypeScript configuration files
├── vite.config.ts        # Vite configuration (React Compiler, Tailwind v4)
├── public/               # Static assets
└── src/
    ├── main.tsx          # Application entry point
    ├── App.tsx           # Global layout, sticky navbar, and route definitions
    ├── index.css         # Global CSS with Tailwind v4 (@import "tailwindcss";)
    ├── assets/           # Application images and SVG icons
    ├── pages/
    │   ├── Home.tsx      # Landing page with hero & navigation
    │   ├── Rooms.tsx     # Data viewer for public.room, public.estate, and joins
    │   ├── Insert.tsx    # Insert forms for public.estate and public.room
    │   └── Todos.tsx     # Alias re-exporting Rooms
    └── utils/
        └── supabase.ts   # Supabase client singleton
```

---

## 3. Database Schema Reference

The app connects to Supabase with the following Postgres tables in the `public` schema:

### `public.room` (21 Columns)
- **Primary Key**: `room_id` (integer)
- **Foreign Key**: `estate_id` (integer, references `public.estate.estate_id`)
- **Listing & Pricing**: `room_type`, `size`, `price`, `bedroom`, `bathroom`
- **Features & Amenities**: `pet`, `pet_allow`, `pet_type`, `furniture`, `electronic`, `parking` (integer, number of cars allowed)
- **Financial & Terms**: `insurance`, `advance`, `distance`, `remark`
- **Contact & Listing URLs**: `link_post`, `contact_line`, `contact_facebook`, `contact_tel`

- **Field Values / Options**:
  - `room_type`: `Studio`, `1 Bed`, `1 Bed Plus`, `2 Bed`, `Duo Space`, `Loft`, `Duplex`, `Corner`, `Clubhouse`, `General`
  - `electronic`: `Washer`, `Refrigerater`, `conditioner`
  - `pet` / `pet_type`: `cat`, `dog`, `etc`

### `public.estate` (4 Columns)
- **Primary Key**: `estate_id` (integer)
- **Details**: `e_name` (Estate / Project name), `location` (Point coordinates), `type` (Estate enum `estate_type`)
- **Field Values / Options**:
  - `type` (`estate_type` enum): `townhome`, `condo`

### Relational Join: `room` ⋈ `estate`
- **Foreign Key**: `public.room.estate_id` references `public.estate.estate_id` (`room_estate_id_fkey`)
- **Query Pattern**: `supabase.from('room').select('*, estate(*)')`
- **Combined Columns (25 Total)**:
  - 21 columns from `room`
  - 4 columns from `estate` (`estate.e_name`, `estate.location`, `estate.type`, `estate.estate_id`)

---

## 4. Key Development Rules & Conventions

### Environment Variables
- In Vite, client-side environment variables **must** be prefixed with `VITE_`.
- Accessed via `import.meta.env.VITE_*`.
- Expected keys in `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)

### Styling with Tailwind CSS v4
- Configured via `@import "tailwindcss";` in `src/index.css`.
- Avoid adding legacy `tailwind.config.js` or `postcss.config.js` unless explicitly requested.
- Use utility classes with dark mode variants (`dark:...`) and responsive prefixes (`sm:...`, `md:...`, `lg:...`).

### TypeScript & Typing
- Ensure all Supabase records have explicit TypeScript interfaces (e.g. `Room`, `Estate`).
- Always run `npm run build` (`tsc -b && vite build`) after editing files to ensure zero type or build errors.

### Code Style & Simplicity
- Follow the principle of simplicity: keep code minimal, clean, and avoid over-engineering.
- Maintain existing comments and structure.
- Never commit credentials, private keys, or `.env` secrets.

---

## 5. Standard Commands

- `npm run dev`: Start Vite development server (default port `5173`).
- `npm run build`: Type-check with TypeScript and build production bundle (`tsc -b && vite build`).
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run Oxlint to verify code quality.
