# 🎤 AI Interview Agent

> Build the interviewer, not the interview.

An AI-powered interview platform that conducts technical interviews using autonomous AI agents. The system generates questions dynamically, interacts with candidates in real time, evaluates responses, and provides structured feedback with scoring.

---

# 📌 Problem Statement

Traditional online interviews require human interviewers, making them expensive, difficult to scale, and inconsistent.

This project automates the interview process by creating an AI Interview Agent capable of:

- Conducting interviews autonomously
- Asking adaptive follow-up questions
- Evaluating candidate responses
- Scoring technical performance
- Generating interview reports

---

# 🚀 Features

- 🤖 AI-powered interviewer
- 💬 Natural conversational interview
- 🧠 Dynamic question generation
- 📊 Automatic candidate evaluation
- 📄 Interview summary generation
- 📈 Candidate scoring
- 🔒 Secure authentication
- 🎙️ Voice/Text interview support (if implemented)
- 📚 Interview history

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- TypeScript

## Backend

- Node.js
- Express.js

## AI

- OpenAI GPT
- Prompt Engineering
- RAG (optional)

## Database

- MongoDB

## Authentication

- JWT

## Deployment

- Vercel
- Render

---

# 🏗️ System Architecture

```

Candidate
│
▼
Frontend (React)
│
▼
Backend API (Express)
│
├────────► Database (MongoDB)
│
└────────► OpenAI API
│
▼
Interview Engine
│
▼
Evaluation Engine
│
▼
Interview Report

```

---

# 📂 Project Structure

```

AI-Interview-Agent/
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── utils/
│ └── package.json
│
├── docs/
│
├── README.md
│
└── .gitignore

```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Interview-Agent.git
```

Move into the project

```bash
cd AI-Interview-Agent
```

---

## Install Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Install Backend

```bash
cd backend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret

OPENAI_API_KEY=your_openai_api_key
```

---

# 📖 Usage

1. Register/Login
2. Start Interview
3. AI asks technical questions
4. Candidate responds
5. AI evaluates answers
6. Final report is generated

---

# 📊 Evaluation Criteria

The AI evaluates candidates based on:

- Technical Knowledge
- Communication Skills
- Problem Solving
- Confidence
- Accuracy
- Completeness of Answers

---

# 📸 Screenshots

Add screenshots here.

```

screenshots/

home.png

login.png

interview.png

report.png

```

---

# 🎯 Future Improvements

- Voice Interviews
- Video Interviews
- Resume Parsing
- Company-specific Interview Modes
- Coding Interview Support
- Live Code Execution
- AI Feedback Dashboard
- Multi-language Support

---

# 🤝 Team

| Name | Role |
|------|------|
| Anayat | Full Stack Developer |
| Faraz | Full Stack Developer |

---

# 📅 Development Workflow

```

main
│
├── frontend
├── backend
└── feature branches

```

---

# 🧪 API Endpoints

## Authentication

```

POST /api/auth/register

POST /api/auth/login

```

## Interview

```

POST /api/interview/start

POST /api/interview/answer

GET /api/interview/report/:id

```

---

# 📦 Dependencies

Frontend

- React
- React Router
- Axios
- Tailwind CSS

Backend

- Express
- Mongoose
- JWT
- bcrypt
- dotenv
- cors

---

# 📄 License

This project is licensed under the MIT License.

---

# 🙏 Acknowledgements

- OpenAI
- React
- Express
- MongoDB
- Vite
- Tailwind CSS

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
