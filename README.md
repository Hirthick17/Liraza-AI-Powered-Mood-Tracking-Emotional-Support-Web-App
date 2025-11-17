# Welcome to your Lovable project

## Project info


## Quick Start

### Local Development (Without Docker)
```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Create .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Step 5: Start development server
npm run dev
```

### Docker Development
```sh
# Build and start development container
docker-compose -f docker-compose.dev.yml up

# Access at http://localhost:5173
```

### Docker Production
```sh
# Build production image
docker build -t liraza-frontend .

# Run production container
docker run -d -p 3000:80 liraza-frontend

# Or use docker-compose
docker-compose up -d
```

**For detailed Docker setup, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)**

**For system architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

## How can I edit this code?

There are several ways of editing your application.



**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend as a Service)
- Docker (Containerization)

 use Docker for production deployment - see [DOCKER_SETUP.md](./DOCKER_SETUP.md) for details.


