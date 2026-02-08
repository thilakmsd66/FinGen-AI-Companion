# FinGen - AI-Powered Financial Education Platform

![GitHub](https://img.shields.io/badge/GitHub-FinGenAI-blue?logo=github)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)
![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Overview

**FinGen** is an innovative AI-powered financial education platform designed to empower users with comprehensive financial knowledge and guidance. It combines cutting-edge AI/LLM technology with a rich knowledge base to provide intelligent financial insights, assessments, and interactive learning experiences.

Whether you're learning about custody banking, fund management, asset custody, or other financial concepts, FinGen provides personalized guidance through an intelligent chatbot and curated educational resources.

---

## ✨ Key Features

### 🤖 **AI Chatbot**
- Real-time financial queries answered by advanced language models
- Context-aware responses using RAG (Retrieval-Augmented Generation)
- Multi-turn conversation support
- Integration with Google Gemini and OpenAI APIs

### 📖 **Knowledge Hub**
- Curated financial documents and educational resources
- Upload and manage custom knowledge base
- Full-text search capabilities
- Document indexing and retrieval system

### 📊 **Assessment Module**
- Financial literacy quizzes and assessments
- Automated scoring and performance tracking
- Detailed feedback and explanations
- Progress visualization with charts

### 🔐 **User Authentication & Management**
- Secure user registration and login
- Password reset with email verification
- Admin dashboard for user management
- Role-based access control

### 👤 **User Profiles**
- Personalized user profiles
- Assessment history and performance tracking
- Saved preferences and settings
- Progress analytics

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Database**: JSON-based storage (scalable to SQL)
- **AI/LLM**: Google Gemini, OpenAI GPT
- **Authentication**: JWT tokens
- **Email**: SMTP for password reset

### **Frontend**
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS3
- **State Management**: React Context API
- **HTTP Client**: Axios

### **DevOps & Deployment**
- Git version control
- GitHub repository
- Docker ready (can be containerized)

---

## 📁 Project Structure

```
fingen-app/
├── backend/
│   ├── ai/
│   │   ├── chatbot.py          # AI chatbot logic
│   │   └── llm.py              # LLM integration
│   ├── assessment/
│   │   ├── evaluator.py        # Assessment evaluation
│   │   ├── questions.py        # Question management
│   │   └── scoring.py          # Scoring logic
│   ├── auth/
│   │   ├── router.py           # Authentication routes
│   │   └── password_reset.py   # Password reset logic
│   ├── knowledge/
│   │   ├── retriever.py        # Knowledge retrieval
│   │   ├── router.py           # Knowledge endpoints
│   │   ├── store.py            # Knowledge storage
│   │   └── uploader.py         # Document upload
│   ├── data/
│   │   └── documents/          # Sample documents
│   ├── storage/
│   │   ├── users.json          # User data
│   │   ├── assessments.json    # Assessment data
│   │   ├── knowledge_store.json# Knowledge index
│   │   └── reset_tokens.json   # Password reset tokens
│   ├── main.py                 # FastAPI app entry
│   └── admin.py                # Admin utilities
│
├── frontend/
│   └── fin-gen-ai-powered/
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   ├── pages/          # Page components
│       │   ├── services/       # API services
│       │   ├── context/        # React contexts
│       │   ├── App.jsx         # Main app component
│       │   └── main.jsx        # React entry
│       ├── index.html          # HTML template
│       ├── package.json        # Dependencies
│       └── vite.config.js      # Vite config
│
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9 or higher
- Node.js 16+ and npm/yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Create .env file with:
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```

5. **Run the backend:**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/fin-gen-ai-powered
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   Update `src/services/api.js` if needed to point to your backend URL.

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Chatbot Endpoints
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat/history` - Get chat history

### Knowledge Base Endpoints
- `POST /api/knowledge/upload` - Upload document
- `GET /api/knowledge/search` - Search knowledge base
- `GET /api/knowledge/documents` - List all documents
- `DELETE /api/knowledge/{doc_id}` - Delete document

### Assessment Endpoints
- `GET /api/assessment/questions` - Get quiz questions
- `POST /api/assessment/submit` - Submit assessment
- `GET /api/assessment/results` - Get assessment results
- `GET /api/assessment/history` - Get user's assessment history

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Get platform analytics

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Email Configuration (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password

# Database (if using SQL)
DATABASE_URL=sqlite:///./fingen.db

# JWT Configuration
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📖 Usage Examples

### Using the Chatbot
```javascript
// Example: Ask financial question
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is custody banking?'
  })
});
const data = await response.json();
console.log(data.response);
```

### Uploading Documents
```bash
curl -X POST "http://localhost:8000/api/knowledge/upload" \
  -F "file=@document.txt"
```

### Taking an Assessment
```javascript
// Fetch questions
const questions = await fetch('http://localhost:8000/api/assessment/questions').then(r => r.json());

// Submit answers
const results = await fetch('http://localhost:8000/api/assessment/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: [1, 2, 0, 3, ...] })
}).then(r => r.json());
```

---

## 🎯 Features Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Personalized learning paths
- [ ] Integration with financial data APIs
- [ ] Gamification features (badges, leaderboards)
- [ ] Export assessment reports (PDF)
- [ ] Real-time collaboration tools
- [ ] Video tutorials and webinars
- [ ] Blockchain-based certifications

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Thilak L**
- Email: thilakmsd66@gmail.com
- GitHub: [@thilakmsd66](https://github.com/thilakmsd66)
- LinkedIn: [Thilak L](www.linkedin.com/in/thilak-suvarna-a8b6411b6)

---

## 🙏 Acknowledgments

- **BITS Pilani** - For the platform and guidance
- **Google Gemini & OpenAI** - For AI/LLM capabilities
- **FastAPI & React Communities** - For excellent frameworks
- All contributors and mentors who supported this project

---

## 📞 Support & Contact

For issues, suggestions, or inquiries:
- Open an issue on GitHub
- Email: thilakmsd66@gmail.com
- Check existing issues and discussions

---

## 🔗 Quick Links

- [GitHub Repository](https://github.com/thilakmsd66/FinGenAI_CapstoneProject_BITS_Pilani)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Gemini API](https://ai.google.dev/)

---

**Made with ❤️ by Thilak L | BITS Pilani Capstone Project 2026**
