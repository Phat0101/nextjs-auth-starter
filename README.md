# PDF Extractor App

A modern web application for extracting data from PDF files using Next.js, Prisma, and PostgreSQL.

## Features

- **User Authentication**: Secure login/registration system
- **PDF Upload**: Upload PDF files up to 10MB
- **Job Management**: Create, view, and track extraction jobs
- **Status Tracking**: Monitor job progress (Pending, Processing, Completed, Failed)
- **Results Display**: View extracted data from your PDFs
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **File Storage**: Local filesystem

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (can use Prisma Postgres)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-auth-starter
npm install
```

### 2. Database Setup

Create a Prisma Postgres instance:

```bash
npx prisma init --db
```

Follow the interactive prompts to:
- Log in to Prisma Console
- Select a region
- Name your project
- Copy the Database URL

### 3. Environment Configuration

Create a `.env` file:

```bash
touch .env
```

Add the following variables:

```env
DATABASE_URL="your-prisma-postgres-url"
AUTH_SECRET="your-32-character-secret"
```

Generate a secure AUTH_SECRET:

```bash
npx auth secret
```

### 4. Database Migration

Run the migration to create tables:

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

Add sample data:

```bash
npx prisma db seed
```

### 6. Create Uploads Directory

```bash
mkdir -p public/uploads
```

### 7. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to use the app.

## Usage

### Creating an Account

1. Click "Sign In" in the header
2. Click "No account? Register" 
3. Fill in your details and register

### Creating an Extraction Job

1. Log in to your account
2. Click "New Job" in the header
3. Fill in the job details:
   - **Job Title**: Descriptive name for your extraction
   - **Description**: What you want to extract from the PDF
   - **PDF File**: Upload your PDF file (max 10MB)
4. Click "Create Extraction Job"

### Managing Jobs

- **View all jobs**: Click "Jobs" in the header
- **View job details**: Click on any job title
- **Delete jobs**: Use the delete button on job detail pages
- **Track status**: See job status (Pending, Processing, Completed, Failed)

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out

### Jobs
- `GET /api/jobs` - Get paginated job list
- `POST /api/jobs` - Create new job (via form action)

## Database Schema

### User Model
- `id`: Unique identifier
- `name`: User's full name
- `email`: Email address (unique)
- `password`: Hashed password
- `jobs`: Related extraction jobs

### Job Model
- `id`: Unique identifier
- `title`: Job title
- `description`: What to extract
- `fileName`: Original file name
- `filePath`: Stored file path
- `status`: Job status (PENDING, PROCESSING, COMPLETED, FAILED)
- `result`: Extraction results
- `userId`: Job owner
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## File Upload

- **Supported formats**: PDF only
- **Maximum size**: 10MB
- **Storage**: Local filesystem (`public/uploads/`)
- **Naming**: Timestamped filenames to avoid conflicts

## Security Features

- **Authentication**: Required for all job operations
- **File validation**: Type and size checking
- **Input sanitization**: Form data validation
- **CSRF protection**: Built-in with NextAuth.js

## Development

### Running Tests

```bash
npm test
```

### Code Formatting

```bash
npm run lint
```

### Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy
```

## Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your-production-db-url"
AUTH_SECRET="your-production-secret"
```

### Build Commands

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check the GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check network connectivity
- Ensure your Prisma Postgres instance is running

### File Upload Issues
- Check file size (must be < 10MB)
- Verify file type (PDF only)
- Ensure uploads directory exists and is writable

### Authentication Issues
- Verify AUTH_SECRET is set
- Check that the user exists in the database
- Clear browser cookies and try again
