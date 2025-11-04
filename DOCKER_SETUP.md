# Docker Setup & Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Docker Files](#docker-files)
3. [Development Setup](#development-setup)
4. [Production Setup](#production-setup)
5. [Docker Commands](#docker-commands)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses Docker for containerized deployment and development. We have separate configurations for:
- **Development**: Hot reload with volume mounting
- **Production**: Optimized multi-stage build with Nginx

---

## Docker Files

### 1. Dockerfile (Production)
**Location**: `Dockerfile`

Multi-stage build for production deployment:
- **Stage 1 (Builder)**: Node.js 20 Alpine - Builds React app
- **Stage 2 (Production)**: Nginx Alpine - Serves static files

**Key Features**:
- Multi-stage build for smaller image size
- Optimized for production performance
- Nginx configuration for SPA routing

### 2. Dockerfile.dev (Development)
**Location**: `Dockerfile.dev`

Development container with hot reload:
- Node.js 20 Alpine base
- Volume mounting for live code updates
- Vite dev server on port 5173

### 3. docker-compose.yml (Production)
**Location**: `docker-compose.yml`

Production orchestration:
- Frontend service with production build
- Nginx serving static files
- Port mapping: 3000:80

### 4. docker-compose.dev.yml (Development)
**Location**: `docker-compose.dev.yml`

Development orchestration:
- Hot reload enabled
- Volume mounting
- Port mapping: 5173:5173

---

## Development Setup

### Prerequisites
```bash
# Install Docker Desktop
# Windows: https://www.docker.com/products/docker-desktop
# Mac: https://www.docker.com/products/docker-desktop
# Linux: sudo apt-get install docker.io docker-compose
```

### Step 1: Create Environment File
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Build Development Container
```bash
# Build the development image
docker-compose -f docker-compose.dev.yml build

# Or build without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Step 3: Start Development Server
```bash
# Start container with hot reload
docker-compose -f docker-compose.dev.yml up

# Start in detached mode (background)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Step 4: Access Application
- **Development**: http://localhost:5173
- Code changes will hot reload automatically

### Development Workflow
```bash
# Start dev server
docker-compose -f docker-compose.dev.yml up

# In another terminal, install new packages
docker-compose -f docker-compose.dev.yml exec frontend-dev npm install package-name

# Stop dev server
docker-compose -f docker-compose.dev.yml down

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build
```

---

## Production Setup

### Step 1: Build Production Image
```bash
# Build production image
docker build -t liraza-frontend:latest .

# Or using docker-compose
docker-compose build
```

### Step 2: Run Production Container
```bash
# Run with docker run
docker run -d \
  --name liraza-frontend \
  -p 3000:80 \
  -e NODE_ENV=production \
  liraza-frontend:latest

# Or using docker-compose
docker-compose up -d
```

### Step 3: Access Application
- **Production**: http://localhost:3000

### Step 4: Verify Deployment
```bash
# Check container status
docker ps

# View logs
docker logs liraza-frontend

# Check container health
docker inspect liraza-frontend
```

---

## Docker Commands

### Image Management
```bash
# List all images
docker images

# Remove image
docker rmi liraza-frontend:latest

# Remove all unused images
docker image prune -a

# Build with specific tag
docker build -t liraza-frontend:v1.0.0 .
```

### Container Management
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop liraza-frontend

# Start stopped container
docker start liraza-frontend

# Restart container
docker restart liraza-frontend

# Remove container
docker rm liraza-frontend

# Remove all stopped containers
docker container prune
```

### Docker Compose Commands
```bash
# Build services
docker-compose build

# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend

# Follow logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build

# Execute command in container
docker-compose exec frontend npm install

# Scale services (if needed)
docker-compose up --scale frontend=3
```

### Development-Specific Commands
```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up

# Build dev environment
docker-compose -f docker-compose.dev.yml build

# Execute npm commands in dev container
docker-compose -f docker-compose.dev.yml exec frontend-dev npm run build

# Access container shell
docker-compose -f docker-compose.dev.yml exec frontend-dev sh
```

### Debugging Commands
```bash
# Inspect container
docker inspect liraza-frontend

# View container stats
docker stats liraza-frontend

# Execute shell in running container
docker exec -it liraza-frontend sh

# View environment variables
docker exec liraza-frontend env

# Check network connectivity
docker network ls
docker network inspect liraza-network
```

---

## Troubleshooting

### Issue: Port Already in Use
```bash
# Find process using port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Kill process or change port in docker-compose.yml
```

### Issue: Container Won't Start
```bash
# Check logs
docker logs liraza-frontend

# Check container status
docker ps -a

# Inspect container
docker inspect liraza-frontend

# Try rebuilding
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Issue: Changes Not Reflecting (Development)
```bash
# Ensure volumes are mounted correctly
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build

# Check volume mounts
docker inspect liraza-frontend-dev | grep Mounts
```

### Issue: Build Failures
```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build --no-cache -t test .
```

### Issue: Permission Denied (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended)
sudo docker-compose up
```

### Issue: Out of Disk Space
```bash
# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove old images
docker image prune -a
```

### Issue: Environment Variables Not Loading
```bash
# Check .env file exists
ls -la .env

# Verify variables are set
docker-compose config

# Pass variables explicitly
docker run -e VITE_SUPABASE_URL=value ...
```

---

## Production Deployment Best Practices

### 1. Use Specific Tags
```bash
# Instead of 'latest', use version tags
docker build -t liraza-frontend:v1.0.0 .
docker tag liraza-frontend:v1.0.0 registry.example.com/liraza-frontend:v1.0.0
```

### 2. Health Checks
Add to Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1
```

### 3. Resource Limits
Add to docker-compose.yml:
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 4. Logging Configuration
```yaml
services:
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Security Scanning
```bash
# Scan image for vulnerabilities
docker scan liraza-frontend:latest

# Use distroless or alpine images (already using alpine)
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t liraza-frontend:${{ github.sha }} .
      - name: Push to registry
        run: |
          docker tag liraza-frontend:${{ github.sha }} registry.example.com/liraza-frontend:${{ github.sha }}
          docker push registry.example.com/liraza-frontend:${{ github.sha }}
```

---

## Performance Optimization

### 1. Multi-Stage Build
Already implemented - reduces final image size by ~80%

### 2. Layer Caching
- Dependencies installed before copying source
- Use .dockerignore to exclude unnecessary files

### 3. Build Arguments
```dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
```

### 4. Nginx Optimization
- Gzip compression enabled
- Static asset caching
- Browser caching headers

---

## Monitoring in Production

### Container Health
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' liraza-frontend

# View health check logs
docker inspect --format='{{json .State.Health}}' liraza-frontend | jq
```

### Resource Usage
```bash
# Monitor resource usage
docker stats liraza-frontend

# Set up monitoring with Prometheus/Grafana
```

---

## Backup & Recovery

### Backup Container Data
```bash
# Export container
docker export liraza-frontend > liraza-backup.tar

# Save image
docker save liraza-frontend:latest > liraza-image.tar
```

### Restore
```bash
# Load image
docker load < liraza-image.tar

# Import container
docker import liraza-backup.tar liraza-restored
```

---

## Common Workflows

### Development
```bash
# 1. Start dev environment
docker-compose -f docker-compose.dev.yml up

# 2. Make code changes (auto-reload)

# 3. Test changes in browser

# 4. Stop when done
docker-compose -f docker-compose.dev.yml down
```

### Production Build
```bash
# 1. Build production image
docker build -t liraza-frontend:latest .

# 2. Test locally
docker run -p 3000:80 liraza-frontend:latest

# 3. Tag for registry
docker tag liraza-frontend:latest registry.example.com/liraza-frontend:v1.0.0

# 4. Push to registry
docker push registry.example.com/liraza-frontend:v1.0.0
```

---

**Document Version**: 1.0  
**Last Updated**: November 2025
