# Overview

PDFo is a comprehensive web-based PDF manipulation and conversion platform that provides users with 22 professional PDF tools including manipulation (merge, split, reorder, delete, rotate, page numbers), security (lock, unlock, watermark), optimization (compress), metadata editing, format conversion FROM PDF (JPG, PNG, TIFF, Word, Excel, PPT, TXT, JSON), and format conversion TO PDF (PNG to PDF, Word to PDF, Excel to PDF). The application is built as a full-stack web application with a React frontend and Express.js backend, designed to handle PDF processing operations efficiently and securely with real PDF processing capabilities.

## Recent Changes (August 17, 2025)
- Simplified header navigation by removing logo and signup buttons (moved to mobile menu)
- Removed tools dropdown from header navigation (tools accessible from homepage and mobile menu) 
- Added comprehensive user dashboard with usage tracking and file management
- Implemented 1-hour automatic file deletion policy for user privacy
- Created user authentication with Firebase integration and dashboard access
- Added usage statistics tracking for all PDF tools by category and frequency
- Implemented temporary file storage system with automatic cleanup

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React 18 with TypeScript, implementing a modern component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing across different PDF tools
- **State Management**: Leverages React Query (@tanstack/react-query) for server state management and caching
- **UI Framework**: Built with shadcn/ui components based on Radix UI primitives, providing a consistent and accessible design system
- **Styling**: Uses Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **File Handling**: Implements drag-and-drop file upload using react-dropzone for intuitive PDF file selection
- **Interactive Features**: Integrates @dnd-kit for drag-and-drop functionality in page reordering operations

## Backend Architecture

The backend follows a minimal Express.js architecture optimized for PDF processing:

- **Server Framework**: Express.js with TypeScript for type safety
- **Development Setup**: Uses Vite in development mode with HMR (Hot Module Replacement) for rapid development
- **Storage Layer**: Implements an abstraction layer with in-memory storage for user data, designed to be easily replaceable with database solutions
- **API Design**: RESTful API structure with centralized route registration and error handling middleware

## PDF Processing Strategy

The application employs a client-side PDF processing approach:

- **Processing Library**: Designed to use pdf-lib for client-side PDF manipulation, reducing server load and improving privacy
- **File Security**: PDF files are processed entirely in the browser, ensuring user documents never leave their device
- **Mock Implementation**: Currently includes simulated PDF operations for demonstration purposes, ready for real pdf-lib integration

## Database Design

Uses Drizzle ORM with PostgreSQL for structured data management:

- **Schema Definition**: Centralized schema definitions in the shared directory for type safety across frontend and backend
- **Migration System**: Configured with Drizzle Kit for database schema migrations
- **User Management**: User profiles linked to Firebase authentication with usage tracking
- **Tool Usage Tracking**: Comprehensive tracking of all PDF tool usage with timestamps and metadata
- **File Management**: Temporary file storage with 1-hour automatic expiration for privacy
- **Logging**: PDF processing logs table for tracking user activities and debugging

## Development Workflow

- **Build System**: Vite for frontend bundling with esbuild for backend compilation
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Path Resolution**: Configured path aliases for clean import statements (@/, @shared/)
- **Development Tools**: Integrated with Replit development environment with cartographer plugin for enhanced debugging

## Theme and Styling System

- **Design System**: Implements a comprehensive design token system with CSS custom properties
- **Color Palette**: Custom PDFo brand colors (blue, emerald, violet) integrated throughout the interface
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS breakpoints
- **Font System**: Uses Inter font family with fallbacks for optimal readability

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern React patterns
- **Express.js**: Backend web framework for API endpoints with performance optimizations
- **Vite**: Build tool and development server with TypeScript support and code splitting
- **TypeScript**: Static type checking across the entire codebase
- **Compression**: Gzip compression middleware for better response times

## UI and Interaction Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives for components
- **@dnd-kit**: Drag and drop functionality for page reordering features
- **react-dropzone**: File upload handling with drag-and-drop interface
- **Lucide React**: Icon library for consistent iconography

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL connection for cloud deployment
- **Drizzle Kit**: Database migration and schema management tool

## Styling and Theme
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Component variant management for consistent styling
- **clsx**: Conditional className utility for dynamic styling

## Development Tools
- **Wouter**: Lightweight router for single-page application navigation
- **@tanstack/react-query**: Data fetching and state management for server state
- **date-fns**: Date manipulation and formatting utilities
- **nanoid**: Unique ID generation for component keys and identifiers

## Performance Optimization Dependencies
- **PDF.js Worker**: Optimized PDF rendering with web workers for non-blocking operations
- **LazyRoute Components**: Code splitting and lazy loading for PDF tool pages
- **Performance Monitoring**: Real-time Web Vitals tracking and memory usage monitoring
- **Asset Optimization**: WebP image support, compression, and caching strategies

## Planned Integrations
- **pdf-lib**: Client-side PDF manipulation library (to be integrated for actual PDF processing)
- **Replit Platform**: Integration with Replit development and deployment environment