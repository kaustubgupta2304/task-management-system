# Task Management System

A full-stack task management application built with **React (Vite)** frontend and **Node.js + Express** backend. Data is stored in-memory (no database).

## Features

- **Dashboard** – List all tasks with title, description, status, priority, and created date
- **Create / Edit / Delete / View** tasks via modals
- **Client-side form validation**
- **Search** by title or description (debounced)
- **Filter** by status and priority
- **Sort** by created date, priority, due date, or title
- **Pagination**
- **Dark mode** toggle
- Responsive UI (desktop & mobile)
- Loading, empty, and error states
- Clean backend architecture (routes → controllers → services)
- Centralized error handling & request validation
- CORS enabled
- Environment variables support

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Vite, React Router |
| Backend  | Node.js, Express.js     |
| Storage  | In-memory (array)       |
| API      | REST                    |

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── routes/task.routes.js
│   │   ├── controllers/task.controller.js
│   │   ├── services/task.service.js
│   │   ├── middleware/errorHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── postman/
│   └── Task_Manager_API.postman_collection.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm

## Setup & Run

### 1. Backend

```bash
cd backend
cp .env.example .env   # optional – defaults to PORT=5000
npm install
npm run dev            # or: npm start
```

Server runs at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000** (proxies `/api` to the backend)

### 3. Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

| Method | Endpoint         | Description          | Status Codes |
|--------|------------------|----------------------|--------------|
| GET    | /api/tasks       | Get all tasks        | 200          |
| GET    | /api/tasks/:id   | Get single task      | 200 / 404    |
| POST   | /api/tasks       | Create task          | 201 / 400    |
| PUT    | /api/tasks/:id   | Update task          | 200 / 404 / 400 |
| DELETE | /api/tasks/:id   | Delete task          | 200 / 404    |
| GET    | /api/health      | Health check         | 200          |

### Query parameters for GET /api/tasks

| Param     | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| search    | string | Search in title & description                    |
| status    | string | `pending` \| `in_progress` \| `completed`       |
| priority  | string | `low` \| `medium` \| `high`                     |
| sortBy    | string | `createdAt` \| `priority` \| `dueDate` \| `title` |
| sortOrder | string | `asc` \| `desc` (default: `asc`)                 |
| page      | number | Page number (default: 1)                         |
| limit     | number | Items per page (default: 10, max: 100)           |

### Example: Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "description": "Build the full-stack task manager",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-10-15"
  }'
```

### Task Object

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending | in_progress | completed",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD | null",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

## Postman Collection

Import `postman/Task_Manager_API.postman_collection.json` into Postman for ready-to-use requests covering all endpoints (including filters, pagination, and error cases).

## Environment Variables

| Variable | Default | Description        |
|----------|---------|--------------------|
| PORT     | 5000    | Backend server port |
| NODE_ENV | development | Environment mode |

Copy `.env.example` to `.env` and adjust as needed.

## Notes

- Task data lives **only in backend memory**. Restarting the server resets all data (sample tasks are re-seeded on startup).
- No database, Firebase, or external auth is used.
- CORS is enabled for the frontend.
- Sample tasks are seeded automatically when the server starts (if the store is empty).

## License

MIT
