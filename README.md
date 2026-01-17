# Superhero Database Web Application

A full-stack web application for managing a superhero database with CRUD operations, image management, and pagination.

## Screenshots

![Example 1](https://raw.githubusercontent.com/Xto-dev/Superheroes/main/Example1.png)

![Example 2](https://raw.githubusercontent.com/Xto-dev/Superheroes/main/Example2.png)

## Overview

This project allows you to create, read, update, and delete superhero records with their associated information and images. The application provides a user-friendly interface for managing superhero data, including their real names, origin descriptions, superpowers, and memorable catch phrases.

## Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

### Frontend
- **Framework**: React 18+ (Next.js)
- **Language**: TypeScript
- **Styling**: CSS

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Features

### CRUD Operations
- ✅ **Create** new superheroes with details and image upload
- ✅ **Read** superhero information with full details and pagination
- ✅ **Update** existing superheroes and manage their images
- ✅ **Delete** superheroes from the database

## Superhero Model

Each superhero record contains:

```
{
  nickname: string              // e.g., "Superman"
  real_name: string            // e.g., "Clark Kent"
  origin_description: string   // Detailed backstory
  superpowers: string[]          // List of powers
  catch_phrase: string         // Famous quote
  images: Image[]              // Associated images
}
```

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your system
- No additional installations needed (everything runs in containers)

### Installation & Running the Application

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd Superhero
   ```

2. **Configure environment variables**
   - Remove the `.example` suffix from `.env.example` files if present
   - Update any necessary configuration values

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build Docker images for both frontend and backend
   - Start all services (backend, frontend, database)
   - Apply database migrations
   - Initialize the database

4. **Access the application**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Documentation**: [http://localhost:5000/api](http://localhost:5000/api)

### Stopping the Application
```bash
docker-compose down
```

## Project Structure

```
superhero-backend/              # NestJS Backend
├── src/
│   ├── superhero/             # Superhero module
│   ├── images/                # Image management module
│   ├── prisma/                # Database service
│   └── main.ts                # Application entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── package.json
└── Dockerfile

superhero-frontend/            # Next.js Frontend
├── app/
│   ├── page.tsx              # Home page (superhero list)
│   ├── create/               # Create superhero page
│   ├── edit/[id]/            # Edit superhero page
│   └── [id]/                 # Superhero details page
├── components/               # Reusable React components
│   ├── SuperheroForm.tsx
│   ├── SuperheroCard.tsx
│   ├── ImageUpload.tsx
│   └── Pagination.tsx
├── lib/
│   └── api.ts                # API client utilities
└── types/                    # TypeScript type definitions

docker-compose.yaml           # Container orchestration
```

## Usage Guide

### 1. View All Superheroes
- Navigate to the home page to see a paginated list of all superheroes
- Each card displays the nickname and a preview image
- Use pagination controls to navigate through pages (5 items per page)

### 2. Create a New Superhero
- Click the "Create" button on the home page
- Fill in all superhero details
- Upload images using the image upload component
- Submit the form

### 3. View Superhero Details
- Click on any superhero card from the list
- View all details including origin description, superpowers, and catch phrase
- View all associated images

### 4. Edit a Superhero
- From the details page, click the "Edit" button
- Modify any superhero information
- Add or remove images as needed
- Save changes

### 5. Delete a Superhero
- From the details page, click the "Delete" button
- Confirm the deletion when prompted

## API Endpoints

### Superhero Endpoints
- `GET /api/superhero` - List all superheroes (with pagination)
- `GET /api/superhero/:id` - Get superhero details
- `POST /api/superhero` - Create new superhero
- `PATCH /api/superhero/:id` - Update superhero
- `DELETE /api/superhero/:id` - Delete superhero

### Image Endpoints
- `POST /api/images` - Upload image
- `DELETE /api/images/:id` - Delete image

View full API documentation at [http://localhost:5000/api#](http://localhost:5000/api#)

## Assumptions & Design Decisions

1. **Database**: PostgreSQL is used as the primary database via Docker
2. **Image Storage**: Images are stored locally in the application filesystem
3. **Pagination**: Fixed at 5 items per page as per requirements
4. **Validation**: Server-side validation on all inputs
5. **Error Handling**: Comprehensive error messages for debugging
6. **State Management**: React hooks and Next.js built-in data fetching
7. **Async Handling**: Middleware and service layers handle async operations with proper error handling

**Project Deadline**: 4 days from email receipt  
**Last Updated**: January 2026
