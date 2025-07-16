# DTAL Audit

A secure login page for the DTAL customs audit system using Next.js and modern web technologies.

## Features

- **Secure Login Interface**: Clean, modern login form
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Security**: Built with security best practices

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Database ORM
- **PostgreSQL**: Database

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) to view the login page

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

This application is configured for deployment on Azure App Service. The GitHub Actions workflow will automatically build and deploy when pushing to the main branch.

## Security

This application follows security best practices including:
- HTTPS enforcement
- Secure headers
- Input validation
- CSRF protection
