# PrepAI – AI-Powered Interview Preparation Platform

PrepAI is a full-stack AI-powered interview preparation platform designed to help students improve their technical interview skills. It provides an interactive environment for interview practice, AI-assisted question generation, and interview preparation.

## Key Features

- **AI-Powered Interview Preparation** – Uses Google Gemini API to support intelligent interview-related functionality.
- **Mock Interview Practice** – Provides an interactive platform for practicing interview questions.
- **User Authentication** – Implements secure authentication using JSON Web Tokens (JWT).
- **Backend REST APIs** – Handles application requests and communication between the frontend and backend.
- **Database Integration** – Uses MongoDB to store application and user data.
- **Responsive User Interface** – Built with React and Tailwind CSS for a user-friendly experience.

## Tech Stack

### Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- TypeScript
- REST APIs
- JWT Authentication

### Database & AI
- MongoDB Atlas
- Mongoose
- Google Gemini API

## Project Structure

```text
PrepAI/
├── client/          # React frontend
├── server/          # Node.js backend
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/arvindanand299-cyber/PrepAI.git
cd PrepAI
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Configure your environment variables in a `.env` file using the required variable names from the project's environment configuration.

Then start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```

## Environment Configuration

Configure the required environment variables for:

- MongoDB connection
- JWT authentication
- Google Gemini API
- Any additional services used by the application

**Important:** Never upload your `.env` file, API keys, database passwords, or private credentials to GitHub.

## Future Enhancements

- Resume-based interview preparation
- Company-specific interview questions
- Detailed interview performance analytics
- Additional programming and technical interview practice
- Deployment and production optimization

## Author

**Arvind Anand**

- GitHub: [arvindanand299-cyber](https://github.com/arvindanand299-cyber)
- Project Repository: [PrepAI](https://github.com/arvindanand299-cyber/PrepAI)

## License

Add or retain the applicable license and attribution for any third-party or adapted source code used in this project.
