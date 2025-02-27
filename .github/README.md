# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the Brainstorm application.

## Supabase Database Migrations

The `supabase-migrations.yml` workflow automatically applies database migrations to your Supabase project when changes are pushed to the `main` branch.

### Required Secrets

To use this workflow, you need to set up the following secrets in your GitHub repository:

1. **SUPABASE_ACCESS_TOKEN**:

   - A personal access token for authenticating with Supabase
   - Generate this token in the Supabase dashboard under Account → Access Tokens

2. **SUPABASE_PROJECT_ID**:

   - Your Supabase project reference ID
   - Found in the URL of your Supabase project: `https://app.supabase.com/project/<project-id>`

3. **SUPABASE_DB_PASSWORD**:
   - The database password for your Supabase project
   - This is the password you set when creating the project

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click on "New repository secret"
4. Add each of the secrets mentioned above

### Workflow Behavior

- The workflow triggers when changes are pushed to the `main` branch in the `supabase/migrations` directory
- It sets up Node.js, installs dependencies and the Supabase CLI
- Links to your Supabase project and runs the migrations
- Provides notifications on success or failure

## Troubleshooting

If the workflow fails, check:

1. Are all the required secrets set up correctly?
2. Does your Supabase CLI version match the requirements of your migrations?
3. Are your migration files valid SQL?
4. Do you have the necessary permissions in your Supabase project?
