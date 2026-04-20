# Meet AI

Meet AI is a Next.js application for running AI-assisted meetings.

Users can:

- create and manage AI agents
- schedule and host meetings
- record and transcribe calls automatically
- generate AI summaries after meetings
- ask follow-up questions about completed meetings
- upgrade to paid plans with Polar subscriptions

## Core Features

- Authentication with Better Auth:
  - email/password sign in
  - OAuth with GitHub and Google
- Agent management:
  - create, update, delete agents
  - attach custom instructions to each agent
- Meeting management:
  - create, update, delete meetings
  - filter meetings by status, agent, and search term
  - pagination for lists
- Real-time meeting experience:
  - Stream Video call creation and join flow (lobby, active, ended states)
  - Stream Chat integration for meeting chat
- Post-meeting intelligence:
  - automatic transcript ingestion
  - GPT-4o summary generation
  - transcript viewer with search and highlighted matches
  - recording playback
  - "Ask AI" chat against meeting summary context
- Subscription and monetization:
  - Polar product listing and checkout
  - customer portal support
  - free-tier limits (agents and meetings)
- Background processing:
  - Inngest workflow to process transcript and save summary

## Tech Stack

- Framework: Next.js 15 (App Router), React 19, TypeScript
- API: tRPC + TanStack React Query
- Database: PostgreSQL (Neon-compatible) with Drizzle ORM
- Auth: Better Auth + Polar Better Auth plugin
- Video/Chat: Stream Video SDK + Stream Chat
- AI: OpenAI GPT-4o
- Jobs: Inngest
- UI: Tailwind CSS v4, shadcn/ui, Radix UI, Sonner

## App Routes

- Public/Auth:
  - `/sign-in`
  - `/sign-up`
- Dashboard:
  - `/` (dashboard home)
  - `/agents`
  - `/agents/[agentId]`
  - `/meetings`
  - `/meetings/[meetingId]`
  - `/upgrade`
- Calls:
  - `/call/[meetingId]`
- APIs:
  - `/api/auth/[...all]`
  - `/api/trpc/[trpc]`
  - `/api/webhook`
  - `/api/inngest`

## Architecture Overview

- `src/modules/*` groups domain logic by feature:
  - `agents`, `meetings`, `premium`, `call`, `auth`, `dashboard`, `upgrade`
- `src/trpc/*` contains router and procedure setup
- `src/db/*` contains Drizzle connection and schema
- `src/app/api/webhook/route.ts` handles Stream webhook events
- `src/inngest/functions.ts` processes transcript events and stores summaries
- `src/components/ui/*` and `src/components/*` provide shared UI primitives and app components

## Meeting Lifecycle

1. User creates a meeting from the dashboard.
2. Server creates a Stream call and enables auto transcription/recording.
3. On call start, webhook marks meeting active and connects OpenAI realtime assistant with agent instructions.
4. On call end, webhook marks meeting as processing.
5. When transcription is ready, webhook stores transcript URL and emits Inngest event.
6. Inngest fetches transcript, enriches speaker data, generates GPT-4o summary, and marks meeting completed.
7. Completed meeting page shows summary, transcript, recording, and Ask AI follow-up chat.

## Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_STREAM_VIDEO_API_KEY=
STREAM_VIDEO_SECRET_KEY=

NEXT_PUBLIC_STREAM_CHAT_API_KET=
STREAM_CHAT_SECRET_KEY=

OPEN_AI_KEY=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

POLAR_ACCESS_TOKEN=
```

Notes:

- `NEXT_PUBLIC_APP_URL` should be your app origin in development and production.

## Database Schema

Main tables:

- `user`, `session`, `account`, `verification` (auth)
- `agents`
- `meetings`

Meeting statuses:

- `upcoming`
- `active`
- `processing`
- `completed`
- `cancelled`

## Free vs Premium Rules

When no active Polar subscription exists:

- max free agents: `1`
- max free meetings: `3`

These checks are enforced in tRPC premium procedures.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

- Create `.env.local` and fill all required values.

3. Push database schema

```bash
npm run db:push
```

4. Run the development server

```bash
npm run dev
```

5. Open the app

- http://localhost:3000

## Scripts

- `npm run dev`: start Next.js dev server
- `npm run build`: build for production
- `npm run start`: start production server
- `npm run lint`: run linting
- `npm run db:push`: push Drizzle schema to DB
- `npm run db:studio`: open Drizzle Studio
- `npm run dev:webhook`: open ngrok tunnel for local webhook testing

## Webhook and Inngest Setup (Local)

To test full meeting processing locally:

1. Run app with `npm run dev`
2. Expose your app with `npm run dev:webhook` (or your own ngrok URL)
3. Configure Stream webhook to send events to your `/api/webhook` endpoint
4. Ensure Inngest endpoint (`/api/inngest`) is reachable from event source

## API Surface

tRPC routers:

- `agents`
  - `getOne`, `getMany`, `create`, `update`, `remove`
- `meetings`
  - `getOne`, `getMany`, `getTranscript`, `create`, `update`, `remove`, `generateToken`, `generateChatToken`
- `premium`
  - `getCurrentSubscription`, `getProducts`, `getFreeUsage`

## Deployment Notes

- Deploy as a standard Next.js app.
- Ensure all environment variables are configured in your host.
- Use a production PostgreSQL database for `DATABASE_URL`.
- Configure Stream webhook and auth OAuth callback URLs to your production domain.
- Configure `NEXT_PUBLIC_APP_URL` to the production origin.
