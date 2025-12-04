# Job Portal - MERN Stack

A complete job portal application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
/backend    - Node.js + Express API server
/frontend   - React + Vite frontend application
```

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
npm install
```

2. Configure environment variables in `.env`:

- `MONGODB_URI` - Your MongoDB Atlas connection string (already configured)
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:5173)

3. Start backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
npm install
```

2. Start frontend development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

### For Job Seekers

- Browse job listings
- Search and filter jobs by location, type, etc.
- Apply for jobs
- Manage applications
- Update profile with skills and experience

### For Employers

- Post job listings
- View job applications
- Track applicants
- Update job status

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/profile/:id` - Get user profile

### Jobs

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/recommendations` - Get recommended jobs

### Applications

- `POST /api/applications/:jobId` - Apply for job
- `GET /api/applications` - Get my applications
- `GET /api/applications/job/:jobId` - Get job applications (employer)
- `PUT /api/applications/:applicationId` - Update application status (employer)

## Database Schema

### Users

- Email, password, name
- User type (job_seeker/employer)
- Profile information (phone, location, bio)
- Skills, experience, education

### Jobs

- Title, description, company
- Location, salary range, job type
- Required skills, experience, requirements
- Employer ID, applicants list
- Status (active/closed/draft)

### Applications

- Job ID, user ID
- Status (pending/reviewed/shortlisted/rejected/accepted)
- Cover letter, notes
- Application timestamps

## Technology Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Running Both Servers

Open two terminal windows:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Notes

- MongoDB Atlas URL is already configured in backend/.env
- Change JWT_SECRET to a strong key for production
- Frontend automatically proxies API calls to backend
