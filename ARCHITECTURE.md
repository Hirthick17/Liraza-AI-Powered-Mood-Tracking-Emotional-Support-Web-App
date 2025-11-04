# Liraza Heartfelt Chat - System Architecture

## Overview

**Liraza Heartfelt Chat** is an AI-powered emotional support companion application providing 24/7 empathetic conversations, mood tracking, and mental health insights.

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: Lovable AI Gateway (GPT-based)
- **Deployment**: Docker, Nginx
- **Infrastructure**: Containerized with multi-stage builds

## System Architecture Diagram

```
Client (Browser) 
    â†“
React SPA (Vite Dev Server / Nginx Production)
    â†“
Supabase Client SDK
    â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Supabase Services  â”‚   AI Services       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Auth (JWT)        â”‚ â€¢ Edge Functions    â”‚
â”‚ â€¢ PostgreSQL DB     â”‚ â€¢ AI Chat Gateway   â”‚
â”‚ â€¢ Storage           â”‚ â€¢ Sentiment Analysisâ”‚
â”‚ â€¢ RLS Policies      â”‚                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Component Architecture

### Frontend Structure
- **Pages**: Index (Landing), Auth, Chat, Mood
- **Components**: AvatarPersona, MoodRing, MoodPicker, ChatMessage, VoiceInput
- **Libraries**: Sentiment analysis, emotion detection
- **State Management**: React Hooks, Context (as needed)

### Backend Structure
- **Database**: PostgreSQL with RLS
  - profiles, chat_messages, conversations, mood_logs
- **Edge Functions**: Deno runtime for AI chat
- **Triggers**: Auto-sentiment analysis on message insert

## Data Flow

1. **Authentication**: User â†’ Supabase Auth â†’ JWT â†’ Session
2. **Chat**: User Input â†’ Supabase â†’ Edge Function â†’ AI Gateway â†’ Response
3. **Mood Tracking**: User Selection â†’ mood_logs table â†’ Health Metrics Calculation
4. **Sentiment**: Message â†’ Trigger Function â†’ analyze_sentiment() â†’ Update conversations table

## Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- HTTPS encryption
- Input validation at client and database levels
- Environment variables for sensitive keys

## Deployment

- **Development**: Docker with hot reload (docker-compose.dev.yml)
- **Production**: Multi-stage Docker build â†’ Nginx serving static assets
- **Ports**: Dev (5173), Production (3000â†’80)

See DOCKER_SETUP.md for detailed Docker implementation.
