# Overview

This is a Korean payroll calculator web application that provides three main calculation tools: salary calculator (실급여 계산기), severance pay calculator (퇴직금 계산기), and annual leave allowance calculator (연차수당 계산기). The application is built with a full-stack architecture using React for the frontend and Express.js for the backend, implementing Korean tax laws and employment regulations for accurate payroll calculations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **Component Structure**: Modular calculator components (SalaryCalculator, SeveranceCalculator, LeaveCalculator)

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for calculation services
- **Validation**: Zod schemas shared between frontend and backend
- **Development Server**: Custom Vite integration for hot module replacement
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM configured
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Current Implementation**: Stateless calculations (no persistent storage required)

## Authentication and Authorization
- **Current State**: No authentication implemented - all calculations are stateless
- **Session Management**: Basic session infrastructure available via connect-pg-simple

## Design Patterns
- **Shared Schema**: Common TypeScript interfaces and Zod schemas in `/shared` directory
- **Component Composition**: Reusable UI components with consistent design system
- **Form Validation**: Client-side and server-side validation using shared schemas
- **Error Boundaries**: Toast notifications for user feedback
- **Responsive Design**: Mobile-first approach with responsive navigation

## Tax Calculation Logic
- **Korean Tax System**: Implements 2024 Korean progressive income tax brackets
- **Deductions**: Basic and dependent deductions according to Korean tax law
- **Insurance Calculations**: National pension, health insurance, long-term care, and employment insurance
- **Severance Pay**: Implements Korean Labor Standards Act severance calculations
- **Leave Allowance**: Annual leave compensation calculations

# External Dependencies

## Core Framework Dependencies
- **@vitejs/plugin-react**: React support for Vite
- **wouter**: Lightweight client-side routing
- **@tanstack/react-query**: Server state management and caching

## UI and Styling
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod

## Database and ORM
- **drizzle-orm**: TypeScript ORM
- **@neondatabase/serverless**: Neon Database PostgreSQL driver
- **drizzle-kit**: Database migration and schema management

## Development Tools
- **tsx**: TypeScript execution engine
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tools

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class concatenation
- **nanoid**: Unique ID generation
- **cmdk**: Command menu implementation