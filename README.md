# 🚀 AI Code Review Assistant

An automated security-focused code review tool that scans public GitHub repositories for:

- 🔍 Security vulnerabilities (via Semgrep)
- 🐍 Dangerous Python patterns (AST analysis)
- 🔐 Hardcoded secrets & exposed credentials
- ⚠️ Risk classification with explanations

Built with **FastAPI + Python + Semgrep**  
Frontend deployed on **Vercel**  
Backend deployed on **Render**

---

## 🌐 Live Demo

Frontend:  
https://ai-code-review-assistant-nine.vercel.app

Backend API:  
https://ai-codereview-assistant.onrender.com

---

# ✨ Features

### 🔎 Repository Analysis
- Clone public GitHub repositories
- Scan entire project structure
- Count total files scanned

### 🛡 Security Scanning
- Semgrep rule-based vulnerability detection
- Python AST dangerous call detection (`eval`, `exec`)
- Regex-based secret detection (AWS keys, private keys, API tokens)

### 📊 Intelligent Risk Mapping
Each issue includes:
- File name
- Line number
- Severity
- Risk explanation
- Suggested fix

---

# 🏗 Tech Stack

## Backend
- FastAPI
- Uvicorn
- GitPython
- Semgrep
- Python AST
- Regex secret scanning

## Frontend
- React
- TypeScript
- Vite
- Deployed on Vercel

## Deployment
- Backend: Render
- Frontend: Vercel

---

# ⚙️ Backend Setup (Local Development)

## 1️⃣ Clone the repository

```bash
git clone https://github.com/Shauryam-singh/AI-CodeReview-Assistant.git
cd AI-CodeReview-Assistant/backend
```

---

## 2️⃣ Create virtual environment

### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

Make sure `requirements.txt` includes:

```
fastapi
uvicorn
gitpython
semgrep
```

---

## 4️⃣ Run the server

```bash
uvicorn app.main:app --reload
```

Server will start at:

```
http://127.0.0.1:8000
```

Swagger docs:

```
http://127.0.0.1:8000/docs
```

---

# 📡 API Endpoints

## Root
```
GET /
```

Response:
```json
{
  "status": "running"
}
```

---

## Analyze Repository

```
POST /analyze/
```

### Request Body:
```json
{
  "repo_url": "https://github.com/user/repository"
}
```

### Response:
```json
{
  "status": "success",
  "total_files_found": 120,
  "total_files_scanned": 120,
  "issues": [
    {
      "file": "app.py",
      "line": 45,
      "message": "Dangerous function 'eval' can lead to Remote Code Execution.",
      "severity": "HIGH",
      "risk": "Remote code execution vulnerability.",
      "tool": "python-ast",
      "suggestion": "Avoid dangerous dynamic execution."
    }
  ]
}
```

---

# 🧠 How It Works

1. Clone public GitHub repository
2. Walk through project files
3. Run:
   - Semgrep scanner
   - AST security analysis
   - Secret pattern detection
4. Aggregate results
5. Return structured JSON response

---

# ⚠️ Limitations (Free Hosting)

If deployed on **Render Free Plan**:
- 512MB RAM limit
- Large repositories may cause memory crash
- Semgrep can be resource intensive

For production usage:
- Upgrade to Render Starter plan
- Or move to background job architecture

---

# 🔒 Security Note

This tool scans **public repositories only**.  
Private repositories require authentication integration.

---


# 🚀 Future Improvements

- Background job processing
- GitHub OAuth integration
- PR auto-commenting
- PDF report export
- Severity score calculation
- Repository size limiter
- Async scanning

---

# 👨‍💻 Author

Built with ❤️ Shauryam Singh

---

# 📜 License

MIT License

---

```
AI-CodeReview-Assistant
├─ backend
│  ├─ .env
│  ├─ app
│  │  ├─ main.py
│  │  ├─ models
│  │  │  ├─ schemas.py
│  │  │  └─ __pycache__
│  │  │     └─ schemas.cpython-313.pyc
│  │  ├─ routes
│  │  │  ├─ analyze.py
│  │  │  ├─ pr_analyze.py
│  │  │  └─ __pycache__
│  │  │     ├─ analyze.cpython-313.pyc
│  │  │     └─ pr_analyze.cpython-313.pyc
│  │  ├─ services
│  │  │  ├─ ast_service.py
│  │  │  ├─ repo_service.py
│  │  │  ├─ risk_service.py
│  │  │  ├─ scan_service.py
│  │  │  ├─ secret_service.py
│  │  │  ├─ semgrep_service.py
│  │  │  └─ __pycache__
│  │  │     ├─ ast_service.cpython-313.pyc
│  │  │     ├─ repo_service.cpython-313.pyc
│  │  │     ├─ risk_service.cpython-313.pyc
│  │  │     ├─ scan_service.cpython-313.pyc
│  │  │     ├─ secret_service.cpython-313.pyc
│  │  │     └─ semgrep_service.cpython-313.pyc
│  │  └─ __pycache__
│  │     ├─ main.cpython-313.pyc
│  │     └─ __init__.cpython-313.pyc
│  └─ requirements.txt
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ Footer.tsx
│  │  │  ├─ FullRepoInputForm.tsx
│  │  │  ├─ landing
│  │  │  │  ├─ CTA.tsx
│  │  │  │  ├─ Features.tsx
│  │  │  │  ├─ Hero.tsx
│  │  │  │  └─ Steps.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ FullRepoInputForm.tsx
│  │  │  │  ├─ Navbar.tsx
│  │  │  │  ├─ PRInputForm.tsx
│  │  │  │  └─ ResultsDashboard.tsx
│  │  │  ├─ Navbar.tsx
│  │  │  └─ PRInputForm.tsx
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ Docs.tsx
│  │  │  └─ LandingPage.tsx
│  │  └─ services
│  │     └─ api.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ LICENSE
└─ README.md

```