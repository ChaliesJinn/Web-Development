# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual laboratory website with a Strapi v5 CMS backend and Vue 3 frontend. The project supports Chinese (zh) and English (en) languages with professional laboratory/academic website design.

## Architecture

### Backend (Strapi v5 CMS)
- **Framework**: Strapi v5.31.2 with headless CMS architecture
- **Database**: SQLite (development) with support for PostgreSQL and MySQL
- **Authentication**: Built-in users-permissions plugin with JWT
- **API**: Default Strapi REST API endpoints
- **File Structure**: Standard Strapi configuration in `backend/` directory
- **Port**: 1337 (configurable via environment variables)

### Frontend (Vue 3 + TypeScript)
- **Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Language**: TypeScript for type safety
- **Build Tool**: Vite for fast development and building
- **UI Library**: Element Plus for components
- **Internationalization**: vue-i18n for Chinese/English support
- **Routing**: vue-router@4 with language prefix routes
- **HTTP Client**: axios for API communication

### Key Technologies Integration
- The frontend communicates with Strapi's REST API endpoints
- Language-aware API requests (locale parameter in all API calls)
- Responsive design targeting desktop-first (1200px centered) with mobile support
- Professional academic/lab website styling inspired by sklois.cn

## Development Commands

### Backend (Strapi)
```bash
cd backend

# Development with hot reload
npm run develop
# or
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Strapi console
npm run console

# Database operations (if needed)
npx strapi db:reset
```

### Frontend (Vue 3)
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
1. Copy `.env.example` to `.env` in both backend and frontend directories
2. Configure backend environment variables (database, keys, etc.)
3. Set `VITE_API_BASE_URL=http://localhost:1337` in frontend `.env`

## Project Structure

### Backend Structure
```
backend/
├── config/          # Strapi configuration files
├── database/        # Database migrations and schema
├── src/            # Custom extensions and bootstrap code
├── public/         # Static assets and uploads
└── .env            # Environment variables
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/   # Reusable Vue components
│   ├── layouts/      # Layout components (BaseLayout, HeaderBar, FooterBar)
│   ├── views/        # Page components
│   ├── services/     # HTTP client and API services
│   ├── types/        # TypeScript type definitions
│   ├── router/       # Vue Router configuration
│   ├── i18n/         # Internationalization files
│   └── assets/       # Static assets
├── public/           # Public static files
└── dist/             # Build output
```

## API Architecture

### Strapi Endpoints
The frontend uses these main API endpoints:
- `/api/site-config` - Site configuration and settings
- `/api/lab-intro` - Laboratory introduction with environment photos
- `/api/news-items` - News articles with categories and attachments
- `/api/news-categories` - News categories
- `/api/team-members` - Team member information with avatars
- `/api/research-projects` - Research projects and team assignments
- `/api/research-outputs` - Research outputs (papers, patents, awards)
- `/api/carousels` - Homepage carousel images

### API Patterns
- All endpoints support locale parameter (`?locale=zh` or `?locale=en`)
- Population using Strapi's `populate=*` syntax
- Proper pagination using Strapi pagination format
- Filtering and sorting via query parameters

## Routing Architecture

### Language-Prefixed Routes
- Base route: `/` redirects to `/zh` (Chinese default)
- Language routes: `/:locale(zh|en)/*`
- Pages: Home, About, Team, NewsList, NewsDetail, Research, Contact
- Dynamic routing for news details: `/:locale/news/:id`

### Route Guards
- Automatic language detection and redirection
- Locale validation (only zh/en supported)
- Title management in both languages

## Component Architecture

### Layout System
- `BaseLayout` - Main layout wrapper with header/footer
- `HeaderBar` - Navigation with language switcher
- `FooterBar` - Site footer information

### Page Components
- Each page is a Vue component with TypeScript
- Composition API with `<script setup>` syntax
- Reactive data fetching from Strapi API

### Shared Components
- `NewsCard` - News article preview cards
- `TeamMemberCard` - Team member display cards
- `ProjectCard` - Research project cards
- `OutputCard` - Research output cards
- `SectionTitle` - Consistent section headers

## Development Guidelines

### Code Organization
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Maintain consistent API service patterns
- Use existing component naming conventions

### Internationalization
- All user-facing text should support both languages
- Use i18n keys in templates: `$t('key.name')`
- API requests must include locale parameter
- Maintain consistent language switching patterns

### Styling
- Follow existing professional academic design patterns
- Use Element Plus components where appropriate
- Maintain responsive design principles
- Keep consistent color scheme (#0052a3 primary blue)

### API Integration
- Use the centralized API service functions in `src/services/api.ts`
- All API calls should return proper TypeScript-typed responses
- Handle loading states and error conditions
- Follow Strapi response patterns for consistency

## Database Considerations

### Content Structure
- News items with categories and multilingual content
- Team members with role-based organization
- Research projects with team assignments
- Media uploads with proper sizing
- Static site configuration

### Local Development
- Uses SQLite by default for easy setup
- Database schema managed through Strapi admin panel
- File uploads stored in `public/uploads/`
- No external database dependencies for development