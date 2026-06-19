# Project Management Application

A full-stack project management web app built with React, Express, and MongoDB.

## What Is Implemented

This section reflects the current codebase behavior.

### Frontend (React)
- Authentication pages: login and registration.
- Dashboard with:
	- total/active/completed project metrics
	- recent projects list
	- calendar view with highlighted active project due dates
- Projects page listing projects assigned to the logged-in user.
- Project details page with:
	- edit/delete project (creator only)
	- mark project as complete
	- task list and task removal
	- team member add/remove
- Tasks page with:
	- per-project task listing
	- task creation and removal (creator only)
	- completed-task approval action (creator only)
- Task details page for viewing task info and marking task done.
- User settings page for profile edit and logout.

### Backend (Node.js + Express + MongoDB)
- User signup/login with bcrypt password hashing at signup and JWT token generation at login.
- CRUD operations for users, projects, and tasks.
- Team member management inside projects.
- Task assignment to multiple users.
- Cross-entity syncing:
	- Project IDs are added/removed from users.
	- Task IDs are added/removed from users and projects.

## Tech Stack

### Frontend
- React 18
- React Router
- Axios + Fetch
- Bootstrap + React Bootstrap
- React Calendar

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- express-validator
- bcrypt

## Project Structure

```
Backend/
	controllers/
	models/
	Routes/
	server.js
frontend/
	src/
		components/
		App.js
		AuthContext.js
README.md
```

## Prerequisites

- Node.js 14+
- npm
- MongoDB running locally on `mongodb://127.0.0.1/project_management`

## Setup and Run

### 1. Clone

```bash
git clone https://github.com/Jainilmodi21/Project-Management-Application.git
cd Project-Management-Application
```

### 2. Install dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Start backend

```bash
cd ../Backend
node server.js
```

Backend runs on `http://localhost:5000`.

### 4. Start frontend

```bash
cd ../frontend
npm start
```

Frontend runs on `http://localhost:3000`.

## API Overview

Base URL: `http://localhost:5000/api`

### User routes
- `GET /user`
- `GET /user/:userId`
- `GET /user/:userId/projects`
- `GET /user/:userId/tasks`
- `POST /user/signup`
- `POST /user/login`
- `PATCH /user/:userId`
- `PATCH /user/change-password/:userId`
- `DELETE /user/:userId`

### Project routes
- `GET /project`
- `GET /project/:projectId`
- `GET /project/:projectId/task/:user_id`
- `GET /project/:projectId/team-members`
- `POST /project`
- `PATCH /project/:projectId`
- `DELETE /project/:projectId`
- `POST /project/:projectId/team-members`
- `DELETE /project/:projectId/team-members/:member_id`
- `DELETE /project/:projectId/:taskId`

### Task routes
- `GET /task`
- `GET /task/:taskId`
- `POST /task/:project_id`
- `PATCH /task/:taskId`
- `PATCH /task/:taskId/add-member`
- `PATCH /task/:taskId/remove-member`
- `DELETE /task/:projectId/:taskId`

## Data Models

### User
- `name: String`
- `email: String`
- `password: String`
- `projects: ObjectId[] -> Project`
- `tasks: ObjectId[] -> Task`

### Project
- `name: String`
- `description: String`
- `startDate: Date`
- `endDate: Date`
- `status: String`
- `created_by: ObjectId -> User`
- `teamMembers: [{ user_id, role, name }]`
- `tasks: ObjectId[] -> Task`

### Task
- `project_id: ObjectId -> Project`
- `name: String`
- `description: String`
- `due_date: Date`
- `status: String`
- `assignedTo: ObjectId[] -> User`
