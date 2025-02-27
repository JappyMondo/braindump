# Supabase Setup for the Braindump App

This directory contains the database schema and migrations for the Braindump app using Supabase.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project (create one at [supabase.com](https://supabase.com))

## Setup Instructions

### 1. Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using pnpm
pnpm add -g supabase
```

### 2. Initialize Supabase Project

```bash
supabase init
```

### 3. Link to Your Supabase Project

Get your project reference ID from the Supabase dashboard (Settings > API).

```bash
supabase link --project-ref your-project-ref
```

When prompted, enter your database password.

### 4. Run Migrations

```bash
supabase db push
```

Alternatively, use the npm scripts:

```bash
# Push migrations
npm run supabase:migrations:push

# Create a new migration
npm run supabase:migrations:new migration_name
```

## Database Schema

The main table in our database is `documents`:

```sql
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  processed_content TEXT,
  processed_blocks JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
```

## Row Level Security (RLS) Policies

We've set up RLS policies to ensure users can only access their own documents:

1. Users can view their own documents
2. Users can create their own documents
3. Users can update their own documents
4. Users can delete their own documents

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Local Development

You can start a local Supabase instance for development:

```bash
npm run supabase:start
```

And access the Supabase Studio:

```bash
npm run supabase:studio
```

When done, stop the local instance:

```bash
npm run supabase:stop
```
