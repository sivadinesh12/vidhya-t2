# Vidhya Backend API (Python / FastAPI)

Production-ready Python backend for the Vidhya AI Study Platform (NEET/JEE/Boards).
Built with **FastAPI + MongoDB (Motor/Beanie) + JWT + bcrypt**.

---

## 📁 Project Structure

```
vidhya-backend-python/
├── main.py                        ← Entry point
├── requirements.txt
├── .env.example                   ← Copy to .env
├── app/
│   ├── core.py                    ← FastAPI app factory
│   ├── config/
│   │   ├── settings.py            ← Pydantic settings (.env loader)
│   │   └── database.py            ← MongoDB + Beanie init
│   ├── models/                    ← Beanie document models (like Mongoose)
│   │   ├── user.py
│   │   ├── flashcard.py
│   │   ├── study_plan.py
│   │   └── progress.py
│   ├── controllers/               ← Business logic
│   │   ├── auth_controller.py
│   │   ├── user_controller.py
│   │   ├── flashcard_controller.py
│   │   ├── studyplan_controller.py
│   │   ├── progress_controller.py
│   │   └── upload_controller.py
│   ├── middleware/
│   │   └── auth_middleware.py     ← JWT verify + role guard
│   ├── routes/                    ← FastAPI routers
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── flashcards.py
│   │   ├── study_plans.py
│   │   ├── progress.py
│   │   └── uploads.py
│   ├── utils/
│   │   ├── jwt_helper.py
│   │   └── response_helper.py
│   └── uploads/                   ← Uploaded files (served statically)
└── logs/
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.10+ — https://python.org
- MongoDB running locally or Atlas — https://mongodb.com/atlas

### 2. Create virtual environment (recommended)
```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/vidhya
JWT_SECRET=your_long_random_secret_key
CLIENT_URL=http://localhost:3000
```

### 5. Run the server
```bash
# Development (auto-reload)
python main.py

# OR with uvicorn directly
uvicorn main:app --reload --port 5000
```

You should see:
```
INFO:     MongoDB connected: mongodb://localhost:27017/vidhya
INFO:     ✅  Vidhya server ready  |  env=development
INFO:     Uvicorn running on http://0.0.0.0:5000
```

### 6. View API Docs (FREE with FastAPI!)
Open in browser:
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**:      http://localhost:5000/redoc

---

## 📡 API Endpoints

All prefixed with `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/signup | ❌ | Register new student |
| POST | /auth/login | ❌ | Login with email + password |
| POST | /auth/google | ❌ | Google OAuth login |
| GET  | /auth/me | ✅ | Get current user profile |
| GET  | /users | ✅ Admin | List all users |
| GET  | /users/:id | ✅ | Get one user |
| PATCH | /users/:id | ✅ | Update own profile |
| DELETE | /users/:id | ✅ Admin | Deactivate user |
| PATCH | /users/:id/role | ✅ Admin | Change user role |
| GET  | /flashcards | ✅ | List my flashcards |
| POST | /flashcards | ✅ | Create flashcard |
| GET  | /flashcards/:id | ✅ | Get one flashcard |
| PUT  | /flashcards/:id | ✅ | Update flashcard |
| DELETE | /flashcards/:id | ✅ | Delete flashcard |
| PATCH | /flashcards/:id/review | ✅ | Mark reviewed |
| GET  | /study-plans | ✅ | List my plans |
| POST | /study-plans | ✅ | Create plan |
| PUT  | /study-plans/:id | ✅ | Update plan |
| DELETE | /study-plans/:id | ✅ | Delete plan |
| PATCH | /study-plans/:planId/sessions/:sessionId/complete | ✅ | Toggle session done |
| GET  | /progress | ✅ | Get my progress |
| POST | /progress/chapters | ✅ | Track new chapter |
| PATCH | /progress/chapters/:id | ✅ | Update chapter % |
| PATCH | /progress/streak | ✅ | Update study streak |
| GET  | /progress/leaderboard | ✅ Admin | Top students |
| POST | /upload/avatar | ✅ | Upload profile photo |
| POST | /upload/image | ✅ | Upload question image |

---

## 🔒 Security Features
- bcrypt password hashing (12 rounds)
- JWT HS256 tokens, configurable expiry
- Role-based access control (admin / user)
- Rate limiting via SlowAPI
- CORS whitelist
- No passwords ever returned in responses

---

## 🧪 Test Signup
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/signup" `
  -Method POST -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com","password":"Test1234","target_exam":"NEET"}'
```
