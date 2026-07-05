# 🚀 MatchMinds

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D%2018.0.0-blue.svg)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![AI/ML Stack](https://img.shields.io/badge/AI%2FML-PyTorch%20%7C%20PyG%20%7C%20Groq%20LLM-orange.svg)](https://pytorch.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://www.mongodb.com/)

**MatchMinds** is an AI-powered team formation platform designed to optimize the hackathon experience. By leveraging Large Language Models (LLMs) to extract technical requirements from problem statements and Graph Neural Networks (GNNs) to suggest highly compatible teammates, MatchMinds builds high-performance teams based on real skills, experience, and collaboration metrics.

---

## 📖 About the Project

At hackathons, finding the right teammates with complementary skills is one of the biggest challenges developers face. **MatchMinds** automates and optimizes this process. 

The platform operates in two main phases:
1. **Requirement Extraction:** An LLM-powered parser analyzes hackathon problem statements to extract target technologies, frameworks, and domain expertise requirements.
2. **Hybrid Recommendation:** A recommendation engine uses a hybrid GNN (Graph Neural Network) architecture coupled with Content-Based filtering. It builds a graph representation of developers, skills, and past collaborations, running deep embeddings to find the most compatible partners.

Additionally, MatchMinds includes real-time messaging workspace and verified GitHub analytics to build trust and facilitate smooth collaboration right from the start.

---

## ✨ Key Features

*   🧠 **AI Skill Extraction Engine:** Automatically identifies detailed tech stacks and requirements from complex hackathon problem statements using **Groq API (Llama-3/Gemma)**.
*   🕸️ **GNN-Based Recommendation System:** Combines a **Graph Convolutional Network (GCN)** with Content-Based similarity filtering to construct optimal team suggestions based on skills, roles, and developer graphs.
*   🔌 **GitHub Profile Verification:** Scrapes and analyzes developer repositories to verify actual coding experience, language proficiency, and contributions.
*   💬 **Real-time Team Workspaces:** Features immediate, multi-room chat functionality powered by **Socket.io** so matched developers can coordinate and plan instantly.
*   📊 **Deep Compatibility Analytics:** Displays visual similarity scores covering technical skills, experience alignment, and project repository history.

---

## 🛠️ Tech Stack

### Frontend
*   **Core:** React.js (Vite)
*   **Styling & UI:** Chakra UI, Tailwind CSS, Framer Motion
*   **State & Networking:** Axios, React Query, React Router Dom
*   **Real-time Integration:** Socket.io-client, React Icons, Lucide React

### Backend & Real-Time Server
*   **Core API Server:** Node.js, Express.js
*   **Real-Time Chat Server:** Socket.io, Express
*   **Database ODM:** Mongoose (MongoDB)
*   **Bridge/Runners:** python-shell, Child Processes

### AI/ML Engine
*   **Graph Framework:** PyTorch, PyTorch Geometric (PyG)
*   **Data Processing:** NumPy, Pandas, Scikit-learn, SciPy
*   **Inference API:** Groq SDK (Llama-3/Gemma models)
*   **Scrapers:** Requests, PyMongo

---

## 📦 Project Structure

```text
MatchMinds/
├── backend/              # Node.js API server and Python ML scripts
│   ├── routes/           # Express REST endpoints (Auth, User, Hackathons, Recs)
│   ├── models/           # Mongoose schemas (User, Chat, Hackathon)
│   ├── recommendation_system.py # PyTorch GNN recommendation model
│   ├── ps_recommender.py # Groq LLM requirement parsing & recommendation logic
│   ├── github_scraper.py # GitHub scraper for developer profile verification
│   └── server.js         # API entrypoint
├── frontend/             # React SPA (Vite)
│   ├── src/components/   # Reusable Chakra UI components
│   ├── src/pages/        # App views (Dashboard, Chat, Recommendation, Auth)
│   └── index.html        # Entrypoint
└── webSocket/            # Dedicated real-time communication server
    ├── index.js          # Socket.io event loop
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
Before you start, make sure you have installed:
*   [Node.js](https://nodejs.org/) v18.0.0 or higher
*   [Python](https://www.python.org/) 3.9 or higher (with `pip`)
*   [MongoDB](https://www.mongodb.com/) (running instance locally or MongoDB Atlas URI)
*   [Groq API Key](https://console.groq.com/) for LLM processing

---

### Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/harshitachhangani/MatchMinds.git
   cd MatchMinds
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install WebSocket Server Dependencies**
   ```bash
   cd ../webSocket
   npm install
   ```

---

### Environment Configuration

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/matchminds
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

---

### Running the Application

You need to start three servers for the full experience: backend API, WebSocket chat, and frontend UI.

1. **Start the Backend API Server**
   ```bash
   cd backend
   npm start
   ```
   *The server runs at `http://localhost:5000`*

2. **Start the WebSocket Chat Server**
   ```bash
   cd webSocket
   npm start
   ```
   *The socket server runs at `http://localhost:3000`*

3. **Start the React Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend runs at `http://localhost:5173` (or `5174`)*

---

## 🧪 Verification & Standalone ML Running

You can test the recommendation system locally using terminal scripts.

### 1. Test Recommendation Output directly via Python
Run the recommendation engine with a user ID:
```bash
python backend/recommendation_system.py <user_id>
```

### 2. Test LLM Problem Statement Skill Matching
Extract skills and get recommendations for a user based on a specific problem statement:
```bash
python backend/ps_recommender.py <user_id> "Build a decentralized finance platform on Ethereum with a React frontend and solidity smart contracts"
```

---

## 📊 Usage Example

### Get Team Recommendations for a Problem Statement

To request teammate suggestions for a specific hackathon project statement:

#### **Request**
*   **Method:** `POST`
*   **Endpoint:** `http://localhost:5000/api/recommendations/65c81f8f3c1d9b3a4f89d421`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <your_jwt_token>`
*   **Body:**
```json
{
  "problem_statement": "Build a decentralized finance platform on Ethereum with a React frontend and Solidity smart contracts."
}
```

#### **Response**
```json
{
  "status": "success",
  "problem_statement": "Build a decentralized finance platform on Ethereum with a React frontend and Solidity smart contracts.",
  "extracted_skills": ["Ethereum", "React", "Solidity", "Smart Contracts", "DeFi"],
  "recommendations": [
    {
      "user_id": "65c81f8f3c1d9b3a4f89d422",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "skills": ["Solidity", "Ethereum", "Web3.js", "Go"],
      "similarity_score": 0.94,
      "role": "Blockchain Developer",
      "github_verified": true
    },
    {
      "user_id": "65c81f8f3c1d9b3a4f89d423",
      "name": "Bob Smith",
      "email": "bob.smith@example.com",
      "skills": ["React", "TypeScript", "Tailwind CSS", "Redux"],
      "similarity_score": 0.88,
      "role": "Frontend Developer",
      "github_verified": true
    }
  ]
}
```

---

## 🤝 Contributing

We welcome contributions to MatchMinds! To contribute:

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code style matches the existing codebase and all local python-geometric / node modules run successfully before submitting a PR.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///d:/Sem%207/MatchMinds/LICENSE) for more details.

Copyright © 2024 Devvrat Singh Rathod.
