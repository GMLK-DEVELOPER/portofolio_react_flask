# React + Flask Task Manager

A simple full-stack task management application built with React (TypeScript) frontend and Flask backend.

## Project Structure

```
project/
├── frontend/          # React TypeScript frontend
└── backend/           # Flask Python backend
```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment (Windows):
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```
   python app.py
   ```

The backend will be running at http://localhost:5000

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be running at http://localhost:3000

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Responsive design
- Backend API with proper error handling 
- Custom animated 404 error page

## Routes

- `/` - Task Manager app
- Any other path - Custom 404 page with animation 