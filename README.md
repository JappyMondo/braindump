# Brainstorm

A modern web application for brainstorming, note-taking, and idea visualization built with Next.js.

## Features

- Markdown editor with real-time preview
- Automatic content processing and visualization
- Document management system
- Dark mode support
- Mobile-responsive design
- Offline support

## Deployment Options

### Using Docker

The easiest way to deploy Brainstorm is using Docker and Docker Compose:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/brainstorm.git
   cd brainstorm
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. Build and start the containers:

   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:3000`

### Manual Deployment

For manual deployment:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/brainstorm.git
   cd brainstorm
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Build the application:

   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Database Migrations

This project uses Supabase for the database and includes GitHub Actions to automatically apply migrations.

### Local Migration Development

To run migrations locally:

1. Install the Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:

   ```bash
   supabase link --project-ref your-project-id
   ```

3. Create a new migration:

   ```bash
   supabase migration new your_migration_name
   ```

4. Apply migrations:
   ```bash
   supabase db push
   ```

### Automated Migrations

When you push changes to the `main` branch that include migration files in the `supabase/migrations` directory, GitHub Actions will automatically apply those migrations to your Supabase project.

See the `.github/README.md` file for instructions on setting up the required GitHub secrets.

## Development

To start the development server:

```bash
npm run dev
```

## License

[MIT](LICENSE)
