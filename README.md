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
   git clone https://github.com/yourusername/professors-attendance-system-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd professors-attendance-system-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

Before running the API, ensure you have the following environment variables configured:

- **DATABASE_URL**: The URL for connecting to the database.
- **PORT**: The port number on which the API will run (default is `3000`).

Create a `.env` file in the root directory with the required configurations.

## Running the API

To start the API locally:

```bash
npm start
```

The server will be running on `http://localhost:3000` (or the port you've configured).

## Technologies Used

- **Node.js** and **Express.js** for server-side logic
- **Sequelize ORM** for database interaction
- **PostgreSQL** as the database
- **JWT** for authentication

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and create a pull request.
