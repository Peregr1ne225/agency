# Agency — Real Estate & Property Management

A modern, high-performance web application built for real estate agencies to manage estate projects, room and house unit listings, transit metrics, and relational database joins powered by Supabase.

---

## 🚀 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/) (with React Compiler)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite`)
- **Backend & Database**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Routing**: [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- **Deployment**: [Vercel](https://vercel.com/) (configured with `vercel.json` SPA routing)

---

## ✨ Features

### 1. Interactive Dashboard (`/`)
- **Live Database Metrics**: Real-time counter of total room listings, estate developments (condos vs. townhomes), relational join columns, and transit lines.
- **Recent Listings Showcase**: Live property cards displaying unit numbers, pricing in ฿ THB/month, floor size, bed/bath counts, parking capacity, and transit distances.
- **Quick Links**: Direct navigation to database schema sections and insertion forms.

### 2. Live Tables & Relational Joins (`/rooms`)
- **`public.room` Table View**: Full inspection of all 22 room listing columns.
- **`public.estate` Table View**: Property development directory with geographic coordinates and estate classification (`condo` / `townhome`).
- **Relational Joins (`room ⋈ estate`)**: Real-time 25-column joined view linking unit listings with estate metadata via foreign key relationships.

### 3. Smart Listing Insertion (`/insert`)
- **Linked Estate Autocomplete**: Custom combobox dropdown matching the exact width of the input, complete with an inline **✕** clear button.
- **Auto-Project Creation**: Type any project name—if it exists, it auto-locks to the existing project type; if new, it automatically inserts into `public.estate` upon form submission.
- **Dynamic Property Types**:
  - **Condo**: `Studio`, `1 Bed`, `1 Bed Plus`, `2 Bed`, `Duo Space`, `Loft`, `Duplex`
  - **Townhome**: `Corner`, `Clubhouse`, `General`
- **Split Transit Distances**: Individual numeric inputs for **MRT**, **BTS**, **ARL**, and **BRT**, automatically formatted as combined distance text (e.g., `MRT 0.5 KM, BTS 1.2 KM`).
- **Multi-Channel Contact Formatting**: Structured inputs for Name and ID/Number across Line (`name/lineid`), Facebook (`name/facebook`), and Phone (`name/phone`).

---

## 🗄️ Database Schema Reference

The application interfaces directly with Supabase PostgreSQL in the `public` schema:

### `public.room` (22 Columns)
- **Primary Key**: `room_id` (integer)
- **Foreign Key**: `estate_id` (references `public.estate.estate_id`)
- **Listing & Pricing**: `room_number`, `room_type`, `size`, `price`, `bedroom`, `bathroom`
- **Amenities**: `pet`, `pet_allow`, `pet_type`, `furniture`, `electronic`, `parking`
- **Terms & Connectivity**: `insurance`, `advance`, `distance`, `remark`
- **Contacts & URLs**: `link_post`, `contact_line`, `contact_facebook`, `contact_tel`

### `public.estate` (4 Columns)
- **Primary Key**: `estate_id` (integer)
- **Details**: `e_name` (project name), `location` (Point coordinates), `type` (`condo` | `townhome`)

### Relational Join (`room ⋈ estate`)
- **Foreign Key**: `public.room.estate_id` &rarr; `public.estate.estate_id` (`room_estate_id_fkey`)
- **Query**: `supabase.from('room').select('*, estate(*)')`
- **Total Combined Columns**: 25 columns

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Supabase](https://supabase.com/) project with the `room` and `estate` tables

### 2. Installation
```bash
git clone https://github.com/your-username/agency.git
cd agency
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (see `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local Vite development server with HMR |
| `npm run build` | Type-check with TypeScript and build production bundle |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run Oxlint to verify code quality |

---

## ☁️ Deployment to Vercel

This project is pre-configured for seamless deployment to **Vercel**:

1. **SPA Routing**: Configured in [`vercel.json`](./vercel.json) to ensure routes like `/rooms` and `/insert` work properly on page refreshes and direct URL visits.
2. **Private Repositories**: Supported on Vercel's free Hobby plan. Your Git repository can remain **Private**.
3. **Deployment Steps**:
   - Push your repository to GitHub.
   - Go to [vercel.com](https://vercel.com) &rarr; **Add New Project** &rarr; Import your repository.
   - In **Environment Variables**, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Click **Deploy**.

---

## 📄 License

Private & proprietary — developed for Agency real estate management.
