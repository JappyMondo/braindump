#!/bin/bash

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI is not installed. Please install it first."
  echo "You can install it with: npm install -g supabase"
  exit 1
fi

# Initialize Supabase project if not already initialized
if [ ! -f "./supabase/config.toml" ]; then
  echo "Initializing Supabase project..."
  supabase init
fi

# Link to existing Supabase project
if [ ! -f "./supabase/.temp/supabase_project_settings" ]; then
  echo "Linking to Supabase project..."
  if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "Please enter your Supabase project ID:"
    read -r SUPABASE_PROJECT_ID
  fi
  
  if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "Please enter your Supabase database password:"
    read -rs SUPABASE_DB_PASSWORD
  fi
  
  supabase link --project-ref "$SUPABASE_PROJECT_ID" --password "$SUPABASE_DB_PASSWORD"
fi

# Run migrations
echo "Running migrations..."
supabase db push

echo "Migration complete!" 