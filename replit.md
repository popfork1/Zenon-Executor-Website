# Zenon Executor - Landing & Download Site

## Overview

Zenon Executor is a landing page and download portal for a Roblox script executor tool. The application features a marketing homepage with feature cards, FAQ section, and a dedicated download page that tracks download counts. It's a full-stack TypeScript application with a React frontend and Express backend, backed by PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main pages: Home (`/`) and Download (`/download`)
- **Styling**: Tailwind CSS with CSS variables for theming (dark gaming aesthetic with neon purple primary and cyan accent colors)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, located in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-triggered animations and hero effects
- **State Management**: TanStack React Query for server state (fetching releases, tracking downloads)
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (mono) loaded via CSS variables (`--font-display`, `--font-body`, `--font-mono`)
- **Path aliases**: `@/*` maps to `client/src/*`, `@shared/*` maps to `shared/*`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Pattern**: RESTful JSON API under `/api/` prefix, with route definitions shared between client and server in `shared/routes.ts`
- **Development**: Vite dev server middleware with HMR served through the Express server
- **Production**: Client built to `dist/public/`, server bundled with esbuild to `dist/index.cjs`
- **Logging**: Custom request logger for API routes with timing information

### Database
- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema**: Single `releases` table in `shared/schema.ts` with fields: id, version, title, description, downloadUrl, downloadCount, createdAt, isLatest
- **Migrations**: Managed via `drizzle-kit push` (schema-push approach, not migration files)
- **Storage Layer**: `DatabaseStorage` class in `server/storage.ts` implementing `IStorage` interface

### API Endpoints
- `GET /api/releases` — List all releases ordered by creation date
- `GET /api/releases/latest` — Get the latest release (marked with `isLatest` flag, falls back to most recent)
- `POST /api/releases/:id/download` — Increment download count for a release

### Shared Code (`shared/`)
- `schema.ts` — Drizzle table definitions and Zod schemas (used by both client and server)
- `routes.ts` — API route definitions with paths, methods, and Zod response schemas (used by both client hooks and server routes)

### Key Design Decisions
1. **Shared route/schema definitions**: Both frontend and backend import from `shared/` to ensure type safety and consistent validation across the stack.
2. **Storage interface pattern**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it possible to swap implementations.
3. **Auto-seeding**: The server seeds initial release data on startup if the releases table is empty.
4. **No authentication**: This is a public-facing site with no user accounts or protected routes.

## External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) driver with `connect-pg-simple` for session support.
- **Google Fonts**: Space Grotesk, Inter, JetBrains Mono, DM Sans, Fira Code, Geist Mono loaded from fonts.googleapis.com
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev-only Replit integrations)
- **No external auth or payment services** are currently active, though the build script references dependencies like `stripe`, `passport`, `jsonwebtoken`, and `nodemailer` in its bundle allowlist.