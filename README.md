# SkillBridge Frontend

Connect with expert tutors and learn anything, anytime.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Better Auth** - Authentication
- **Shadcn UI** - UI components
- **Zod** - Schema validation
- **Sonner** - Toast notifications

## Features

### Public Features

- Browse and search tutors by category, price, and rating
- View detailed tutor profiles with reviews
- Responsive design for all devices
- Server-side rendering for optimal performance

### Student Features

- Register and login as a student
- Book tutoring sessions
- View upcoming and past bookings
- Leave reviews after completed sessions
- Manage profile

### Tutor Features

- Register and login as a tutor
- Create and update tutor profile
- Set availability slots
- View teaching sessions and earnings
- See ratings and reviews

### Admin Features

- View all users (students and tutors)
- Manage user status (ban/unban)
- View all bookings
- Manage categories (create/delete)
- Platform statistics dashboard

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Backend API running (see backend README)

### Installation

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Set up environment variables:
   Create a \`.env.local\` file:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   \`\`\`

3. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

\`\`\`
frontend/
├── app/ # Next.js App Router pages
│ ├── admin/ # Admin dashboard pages
│ ├── dashboard/ # Student dashboard pages
│ ├── tutor/ # Tutor dashboard pages
│ ├── tutors/ # Tutor browsing and details
│ ├── login/ # Login page
│ └── register/ # Registration page
├── actions/ # Server actions for API calls
├── components/ # Reusable React components
│ ├── ui/ # Shadcn UI components
│ └── admin/ # Admin-specific components
├── lib/ # Utilities and configurations
├── types/ # TypeScript type definitions
└── public/ # Static assets
\`\`\`

## Key Pages

- \`/\` - Homepage with hero, features, and featured tutors
- \`/tutors\` - Browse all tutors with filters
- \`/tutors/[id]\` - Tutor profile detail page
- \`/tutors/[id]/book\` - Book a session with a tutor
- \`/login\` - Login page
- \`/register\` - Registration page (student/tutor)
- \`/dashboard\` - Student dashboard
- \`/dashboard/bookings\` - Student bookings list
- \`/tutor/dashboard\` - Tutor dashboard
- \`/tutor/profile\` - Edit tutor profile
- \`/admin\` - Admin dashboard
- \`/admin/users\` - User management
- \`/admin/categories\` - Category management
- \`/admin/bookings\` - All bookings view

## API Integration

The frontend uses server actions to communicate with the backend API. All API calls are defined in the \`actions/\` directory.

## Authentication

Authentication is handled by Better Auth with role-based access control.

## Building for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
