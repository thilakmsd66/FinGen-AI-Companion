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
- Integration with Google Gemini, OpenAI APIs, and Ollama (local LLMs)
- Offline capability with Ollama for privacy-first deployments

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
- **AI/LLM**: Google Gemini, OpenAI GPT, and Ollama (local LLMs)
- **RAG Engine**: Custom Retrieval-Augmented Generation implementation
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

## � Advanced Features Explained

### **RAG (Retrieval-Augmented Generation)**

RAG is a powerful AI technique that combines document retrieval with language generation to provide accurate, contextual answers backed by actual data.

#### How RAG Works in FinGen:

1. **Document Indexing**: Financial documents are processed and indexed using embeddings
2. **Query Processing**: When a user asks a question, the query is converted to embeddings
3. **Retrieval**: The most relevant documents are retrieved from the knowledge base
4. **Generation**: The LLM generates a response using both the query and retrieved documents
5. **Answer**: User gets an answer grounded in actual financial data, not just LLM hallucinations

#### Benefits:
- ✅ **Accuracy**: Answers are backed by actual documents
- ✅ **Transparency**: Users can see sources of information
- ✅ **Reduced Hallucination**: LLM references real data
- ✅ **Custom Knowledge**: Can add domain-specific documents
- ✅ **Up-to-date**: Knowledge base can be updated without retraining

#### Implementation in FinGen:
```
User Query → Embedding → Document Retrieval → Context + Query → LLM → Grounded Answer
                              ↓
                     Knowledge Base (PDFs, TXTs)
```

---

### **Ollama - Local LLM Integration**

Ollama is an open-source framework that allows running large language models locally without cloud APIs, providing privacy, cost savings, and offline capabilities.

#### Supported Models:
- **Llama 2** - Meta's open-source LLM, excellent for general tasks
- **Mistral** - Lightweight, fast model for quick responses
- **Neural Chat** - Optimized for conversational AI
- **Orca** - Small but powerful model
- **Vicuna** - Fine-tuned for instruction following

#### Advantages of Using Ollama:

| Feature | Cloud LLM | Ollama (Local) |
|---------|-----------|----------------|
| **Privacy** | Data sent to cloud | Data stays local |
| **Cost** | Pay per API call | One-time download |
| **Latency** | Network dependent | Sub-second local |
| **Offline** | Requires internet | Works offline |
| **Customization** | Limited | Full control |
| **Compliance** | Regulatory concerns | HIPAA, GDPR friendly |

#### Setting Up Ollama with FinGen:

1. **Install Ollama**: Download from https://ollama.ai
2. **Pull a Model**:
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   ```

3. **Run Ollama Server**:
   ```bash
   ollama serve
   # Listens on http://localhost:11434
   ```

4. **Configure FinGen Backend**:
   ```python
   # backend/ai/llm.py
   from ollama import Client
   
   client = Client(host='http://localhost:11434')
   response = client.generate(
       model='llama2',
       prompt='What is custody banking?'
   )
   ```

5. **Use in Chatbot**:
   The chatbot automatically detects and uses Ollama when available, falling back to cloud APIs if needed.

#### RAG + Ollama Pipeline:

```
User Input
    ↓
Document Retrieval (RAG)
    ↓
Context Building
    ↓
Ollama Local Model
    ↓
Financial Answer (Private, Fast, Accurate)
```

#### Use Cases:
- 🏦 **Banks**: Comply with data residency requirements
- 🏥 **Healthcare**: HIPAA-compliant financial guidance
- 🔒 **Government**: Restricted data handling
- 📱 **Offline Learning**: Mobile app without internet
- 💰 **Cost Optimization**: No API charges

---

## �📚 API Documentation

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

### Using the Chatbot with Cloud LLMs
```javascript
// Example: Ask financial question using OpenAI/Gemini
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is custody banking?',
    model: 'openai' // or 'gemini'
  })
});
const data = await response.json();
console.log(data.response);
```

### Using the Chatbot with Ollama (Local)
```javascript
// Example: Ask financial question using local Ollama model
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is custody banking?',
    model: 'ollama', // Uses local Ollama
    model_name: 'llama2' // Specific Ollama model
  })
});
const data = await response.json();
console.log(data.response);
```

### RAG-Enhanced Response
```python
# Backend example: RAG implementation
from backend.knowledge.retriever import retrieve_documents
from backend.ai.llm import generate_response

# User question
query = "What are the risks in asset custody?"

# Step 1: Retrieve relevant documents
documents = retrieve_documents(query, top_k=3)

# Step 2: Build context
context = "\n".join([doc['content'] for doc in documents])

# Step 3: Generate grounded answer
response = generate_response(
    query=query,
    context=context,
    model='ollama',  # or 'openai', 'gemini'
)

# Response includes source documents
print(f"Answer: {response['answer']}")
print(f"Sources: {response['sources']}")
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
- LinkedIn: [Thilak L](https://linkedin.com/in/thilak)

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
