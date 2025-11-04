# Supabase Setup Instructions

## Database Connection Error Fix

If you're experiencing a database connection error when creating an account, follow these steps:

### 1. Create Environment Variables File

Create a `.env` file in the root directory of your project with the following variables:

```env
VITE_SUPABASE_URL=https://xdddemopdxcsvfzxicng.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key_here
```

**Important:** Replace `your_anon_public_key_here` with your actual Supabase anon/public key from your Supabase project settings.

### 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Navigate to your project dashboard
3. Go to **Settings** → **API**
4. Find the **Project URL** and **anon/public key**
5. Copy these values to your `.env` file

### 3. Run Database Migrations

Make sure all database migrations are applied to your Supabase project:

1. If using Supabase CLI, run:
   ```bash
   supabase db push
   ```
   
2. Or manually run the SQL migrations in the `supabase/migrations/` folder from the Supabase SQL editor

### 4. Verify Database Schema

Ensure the following tables and triggers exist in your database:
- `profiles` table
- `chat_messages` table
- `conversations` table
- `mood_logs` table
- `handle_new_user()` trigger function (creates profile on signup)

### 5. Restart Development Server

After creating the `.env` file:
```bash
npm run dev
```

### Troubleshooting

- **Error: "Supabase configuration is missing"**
  - Make sure your `.env` file is in the root directory
  - Verify the variable names are correct (VITE_ prefix is required)
  - Restart your development server after creating/modifying `.env`

- **Error: "database connection error"**
  - Check that your Supabase project is active and running
  - Verify your API keys are correct
  - Ensure RLS (Row Level Security) policies are properly configured
  - Check browser console for detailed error messages

### Security Notes

- Never commit your `.env` file to version control
- The `.gitignore` should already include `.env`
- Keep your anon key secure (it's public but tied to your project)

