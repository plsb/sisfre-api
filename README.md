# IFCE Cedro Professors Attendance System API

This is the API for the Professors Attendance System at the **IFCE Cedro Campus**. It provides an interface for managing professors' attendance records, school Saturdays, courses, subjects, and semesters. The system allows for tracking of attendance, creation and management of school events, and other administrative features related to the faculty.

## Features

- **CRUD Operations** for:
  - Courses
  - School Saturdays (Special class days)
  - Semesters
  - Subjects
- Register and track attendance for professors.
- Manage school-specific events such as school Saturdays.
- Retrieve, create, update, and delete course and subject data.

## Endpoints

The API offers several RESTful endpoints, including but not limited to:

- **GET /courses** - Retrieve all courses
- **POST /courses** - Create a new course
- **GET /school-saturdays** - Retrieve all school Saturdays
- **POST /school-saturdays** - Register a new school Saturday
- **GET /semesters** - Retrieve all semesters
- **POST /semesters** - Create a new semester
- **GET /subjects** - Retrieve all subjects
- **POST /subjects** - Add a new subject

## Installation

To get started with the API, clone this repository and install the dependencies:

1. Clone the repository:

   ```bash
   git clone https://github.com/plsb/sisfre-api
   ```

2. Navigate to the project directory:

   ```bash
   cd sisfre-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the required configurations:
- DB_HOST=host
- DB_USER=user
- DB_PASSWORD=password
- DB_NAME=sisfre
- JWT_SECRET=secrectkey

## Running the API

To start the API locally:

```bash
npm start OR npm run dev
```

The server will be running on `http://localhost:3000` (or the port you've configured).

## Technologies Used

- **Node.js** and **Express.js** for server-side logic
- **Sequelize ORM** for database interaction
- **MariaDB** as the database
- **JWT** for authentication

