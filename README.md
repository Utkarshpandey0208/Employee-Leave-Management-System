# Employee Leave Management System

A complete full-stack mini project built with React, Tailwind CSS, Node.js, and Express.


Live Demo : https://employee-leave-management-system-live.vercel.app

## Features

- Employee and admin login with separate role-based dashboards
- Employee leave balance cards, leave application form, and leave history
- Admin dashboard with total employees, total requests, and pending count
- Admin approval and rejection workflow with confirmation modals
- Search and status filters for leave records
- Pagination in the admin request table
- Dark mode toggle
- Toast notifications, loading states, validation, and API error handling
- Dummy data included for employees, admin, and leave requests

## Folder Structure

```text
frontend/
  src/
    components/
    context/
    pages/
    services/
    App.js
    index.js
backend/
  controllers/
  models/
  routes/
  server.js
```

## Sample Credentials

Employee:

```text
Email: aarav@company.com
Password: employee123
```

Admin:

```text
Email: admin@company.com
Password: admin123
```

## Run In VS Code

Open two terminals from the project root.

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in the browser. The backend API runs on `http://localhost:5000`.

## Notes

Data is stored in memory on the Express server for easy project review. Restarting the backend resets the dummy data.
