# SkillBridge — Frontend

> A modern tutoring marketplace where students discover and book sessions with expert tutors across a wide range of subjects.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)

---

## Overview

**SkillBridge** is a full-stack tutoring platform that connects students with qualified tutors. The frontend is built with **Next.js 16 (App Router)**, providing a fast, server-rendered experience with role-based dashboards for students, tutors, and admins.

Key capabilities:

- Browse and search tutors by category, subject, and availability
- View detailed tutor profiles with reviews and ratings
- Book, manage, and track tutoring sessions
- Role-specific dashboards for students, tutors, and administrators
- Tutor availability management and session tracking
- Admin tools for managing users, bookings, and categories
- Dark / light theme support
- Fully type-safe with TypeScript and Zod validation

---

## Tech Stack

| Category        | Technology                                                                  |
| --------------- | --------------------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) (App Router)                              |
| Language        | [TypeScript](https://www.typescriptlang.org/)                               |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| UI Components   | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Authentication  | Custom JWT (cookie-based, decoded client-side)                              |
| Forms           | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)   |
| Icons           | [Lucide React](https://lucide.dev/)                                         |
| Theming         | [next-themes](https://github.com/pacocoursey/next-themes)                   |
| Env Validation  | [@t3-oss/env-nextjs](https://env.t3.gg/)                                    |
| Package Manager | [pnpm](https://pnpm.io/)                                                    |

---

## Project Structure

```
frontend/
├── public/                     # Static assets
└── src/
    ├── action/                 # Server actions
    │   ├── adminActions.ts
    │   ├── authActions.ts
    │   ├── bookingActions.ts
    │   ├── reviewActions.ts
    │   └── tutorActions.ts
    ├── app/                    # Next.js App Router
    │   ├── (commonLayout)/     # Public-facing pages
    │   │   ├── (auth)/         # Auth pages (login, signup, verify)
    │   │   ├── tutors/         # Tutor listing & profiles
    │   │   └── page.tsx        # Home / Landing page
    │   ├── (protectedLayout)/  # Authenticated pages
    │   │   ├── dashboard/      # Student dashboard
    │   │   ├── tutor-dashboard/# Tutor dashboard
    │   │   └── admin-dashboard/# Admin dashboard
    │   └── api/                # Next.js API routes
    ├── components/             # Reusable UI components
    │   ├── ui/                 # shadcn/ui primitives
    │   ├── admin/              # Admin-specific components
    │   ├── dashboard/          # Student dashboard components
    │   ├── tutor/              # Tutor dashboard components
    │   └── tutors/             # Tutor listing components
    ├── constants/              # Shared constants (roles, etc.)
    ├── hooks/                  # Custom React hooks
    ├── lib/                    # Utilities & API client
    │   ├── api.ts
    │   ├── auth.ts
    │   └── utils.ts
    ├── services/               # Data-fetching service layer
    ├── env.ts                  # Type-safe env validation
    └── proxy.ts                # API proxy config
```

---

## Pages & Routes

### Public Routes

| Route          | Description                   |
| -------------- | ----------------------------- |
| `/`            | Landing page                  |
| `/tutors`      | Browse & search all tutors    |
| `/tutors/[id]` | Individual tutor profile page |
| `/login`       | Student / Tutor login         |
| `/signup`      | New user registration         |
| `/verify`      | Email verification            |

### Student Dashboard (Protected)

| Route                 | Description            |
| --------------------- | ---------------------- |
| `/dashboard`          | Student overview       |
| `/dashboard/bookings` | View & manage bookings |
| `/dashboard/profile`  | Edit student profile   |
| `/dashboard/tutors`   | Saved / browsed tutors |

### Tutor Dashboard (Protected)

| Route                           | Description                 |
| ------------------------------- | --------------------------- |
| `/tutor-dashboard`              | Tutor overview              |
| `/tutor-dashboard/profile`      | Edit tutor profile          |
| `/tutor-dashboard/availability` | Manage available time slots |
| `/tutor-dashboard/sessions`     | Upcoming & past sessions    |
| `/tutor-dashboard/reviews`      | View student reviews        |

### Admin Dashboard (Protected)

| Route                         | Description             |
| ----------------------------- | ----------------------- |
| `/admin-dashboard`            | Admin overview          |
| `/admin-dashboard/users`      | Manage all users        |
| `/admin-dashboard/bookings`   | Manage all bookings     |
| `/admin-dashboard/categories` | Manage tutor categories |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/skillbridge.git
cd skillbridge/frontend

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values (see Environment Variables section)

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# URL of the SkillBridge backend API
BACKEND_URL=http://localhost:5000/api
```

| Variable      | Description                       | Default                                        |
| ------------- | --------------------------------- | ---------------------------------------------- |
| `BACKEND_URL` | Base URL for the backend REST API | `https://skillbridge-iota-ebon.vercel.app/api` |

> Environment variables are validated at build time using `@t3-oss/env-nextjs` and Zod. The app will fail fast if a required variable is missing or malformed.

---

## Available Scripts

Run all scripts from the `frontend/` directory:

```bash
pnpm dev        # Start development server (Turbopack)
pnpm build      # Create an optimised production build
pnpm start      # Serve the production build
pnpm lint       # Run ESLint
```

---

## Authentication

Authentication uses a **custom JWT + cookie** approach. The backend issues a signed JWT on login which is stored as an `HttpOnly` cookie named `token`. On the frontend, the token payload is decoded in server components (`src/lib/auth.ts`) to extract the user's `id`, `role`, and `email` for UI-level access control — signature verification is delegated entirely to the backend.

Role-based access is enforced at the layout level:

- `(commonLayout)` — publicly accessible
- `(protectedLayout)` — requires an active session; unauthenticated users are redirected to `/login`
