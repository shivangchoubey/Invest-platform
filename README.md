# 🚀 Startup Investment Platform
A full-stack, dockerized platform connecting **Founders** and **Investors** for startup fundraising. The platform allows founders to list their startups, investors to buy equity in approved startups, and features an internal administrative panel for listing moderation and verification. 
It features real-time, role-authorized chat rooms for active discussion.
🌐 **Live Website Link:** [https://invest-platform-1.onrender.com/](https://invest-platform-1.onrender.com/)
---
## 🛠️ Tech Stack
### Frontend
* **Core:** React 19, Vite, JavaScript
* **Routing:** React Router v7
* **Styling:** TailwindCSS (v4) with PostCSS & Autoprefixer
* **HTTP Client:** Axios
* **Real-time Communication:** Socket.io Client
### Backend
* **Core:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud Database via Mongoose ODM)
* **Real-time Communication:** Socket.io Server
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt & BcryptJS (Password Hashing)
* **Validation:** Zod (Request schema validation)
### CI/CD & Deployment
* **CI/CD Pipeline:** GitHub Actions
* **Hosting Platform:** Render
* **Containerization:** Docker & Docker Compose (for local development and builds)
* **Web Server:** Nginx (Serves the production-built React frontend inside the Docker container)
---
## 🔑 Public User Roles & Features
Users can register publicly as either a **Founder** or an **Investor**.
### 👤 Founder
* **Create Startup Listing:** List startups with details (Title, Description, Industry Type, Opportunity, Funding Goal, Equity Offered, Pitch PDF URL, Pitch Video URL, Cover Image).
* **Manage Listings:** 
  * Update startup cover image.
  * Resubmit startup for verification if rejected or flags are resolved.
  * Increase or update the funding goal (`raise-again`).
  * Remove startup from active status (`REMOVED`).
  * Permanently delete removed startups (along with all associated investments).
* **Live Q&A Chat:** Join real-time discussion rooms for their own startup, interact with verified investors, and clear chat history when needed.
### 💼 Investor
* **Explore Startups:** Browse approved startups, filter and sort by creation date, funding goal, or funding progress.
* **Invest in Startups:** Invest funds into approved startups and receive equity based on the amount.
* **Flag Startups:** Flag suspicious or questionable startup listings with a custom reason for admin review.
* **Live Q&A Chat:** Participate in live real-time chats with founders of approved startups.
---
## 🛡️ Administrative Moderation (Internal Panel)
Administrative features are restricted to internally assigned admin accounts (not open for public registration) to moderate platform integrity:
* **Listing Verification:** View pending startup submissions and approve or reject them.
* **Moderate Flags:** View flagged startups, review the flagging investor and reasons, choose to ignore flags, or force-remove flagged startups.
---
## 🚀 CI/CD & Deployment Workflow
### GitHub Actions
The project includes a GitHub Actions CI/CD workflow defined in `.github/workflows/deploy.yml` that triggers on push and pull requests to `main`:
1. **Build & Test:** Checks out the codebase, sets up Node.js v22, and verifies package installation for backend and frontend.
2. **Docker Build & Push:** If the build passes on the `main` branch, it builds production Docker images for both `frontend` and `backend` and pushes them to Docker Hub.
### Render Hosting
* The frontend and backend services are deployed on Render.
* Frontend requests are routed to the Express.js server on Render, which connects to the cloud-hosted MongoDB Atlas cluster.

## 📂 Project Structure
```text
invest-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD Pipeline (Build, Test, and Push to Docker Hub)
├── backend/
│   ├── config/             # Database connection & configurations (MongoDB Atlas)
│   ├── controllers/        # Route controllers (auth, admin, startup, investment)
│   ├── middlewares/        # Authentication, authorization, and validation middlewares
│   ├── models/             # Mongoose schemas (User, Startup, Investment, Message)
│   ├── routes/             # Express API routes
│   ├── validations/        # Zod validation schemas
│   ├── utils/              # Helper utilities (e.g., chat access checker)
│   ├── server.js           # Server entry point
│   ├── socket.js           # Socket.io configurations and event handlers
│   └── Dockerfile          # Production Docker configuration for Node.js
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App assets
│   │   ├── components/     # UI, Layout, and dashboard components (Founder, Investor, Admin)
│   │   ├── context/        # React context (Auth context, etc.)
│   │   ├── hooks/          # Custom react hooks
│   │   ├── pages/          # Page components (Home, Login, Register, Startup Details)
│   │   ├── services/       # API call handlers (Axios service instances)
│   │   ├── utils/          # Frontend helpers
│   │   ├── App.jsx         # App router and layouts
│   │   └── main.jsx        # App entry point
│   ├── nginx.conf          # Nginx server configuration for hosting React build
│   └── Dockerfile          # Multi-stage Docker configuration (Build + Nginx serve)
└── docker-compose.yml      # Orchestration for local development
```

🔌 API Endpoints Reference

🔐 Authentication (/api/auth)
```text
POST /api/auth/register - Register a new user (restricted to roles FOUNDER or INVESTOR).
POST /api/auth/login - Login user and return JWT token.
GET /api/auth/me - Get profile of the currently logged-in user.
```
🚀 Startup Management (/api/startups)
```text
GET /api/startups - Get all approved startups (Public route with pagination & sorting).
GET /api/startups/my - Get all startups listed by the logged-in founder.
POST /api/startups - Create a new startup listing (Founder only).
GET /api/startups/:id - Get details of a specific approved startup (including investor details).
PUT /api/startups/:id/image - Update cover image of a startup (Founder only).
DELETE /api/startups/:id - Soft remove a startup (Founder only).
DELETE /api/startups/:id/complete - Completely delete a soft-removed startup and its investments (Founder only).
PUT /api/startups/:id/raise-again - Update the funding goal of a startup (Founder only).
PUT /api/startups/:id/resubmit - Resubmit a rejected or removed startup for verification (Founder only).
POST /api/startups/:id/flag - Flag a startup listing (Investor only).
GET /api/startups/:id/messages - Retrieve chat history for a startup room.
DELETE /api/startups/:id/messages - Clear chat history of a startup room (Founder only).
```
💳 Investments (/api/invest)
```text
POST /api/invest - Invest in an approved startup (Investor only).
GET /api/invest/my - List all investments made by the logged-in investor.
DELETE /api/invest/:id - Cancel/delete an investment (Investor only).
```
🛡️ Admin Actions (/api/admin)
```text
GET /api/admin/pending - List all pending startup submissions (Internal admin only).
PUT /api/admin/approve/:id - Approve a pending startup (Internal admin only).
PUT /api/admin/reject/:id - Reject a pending startup (Internal admin only).
GET /api/admin/flagged - List all flagged startups (Internal admin only).
PUT /api/admin/flagged/:id/ignore - Ignore flags on a startup (Internal admin only).
DELETE /api/admin/startups/:id - Permanently remove a flagged startup (Internal admin only).
```
💬 Live Chat WebSockets Events

The application uses Socket.io for real-time discussions inside startup detail pages.

Client-to-Server Events

```text
join-room (startupId) - Joins the room for the specified startup (validated against user credentials and startup verification status).
send-message ({ startupId, content }) - Dispatches a message to the startup's discussion board.
clear-chat (startupId) - Clears chat history of a startup (restricted to the startup's founder).
```
Server-to-Client Events
```text
receive-message (messageObject) - Broadcasts a new chat message to all connected clients in the room.
chat-cleared - Signals clients in the room to flush the chat display.
error-message (message) - Alerts the client in case of authorization failures or other errors.

```
⚙️ Environment Variables

```text
Backend Configuration (backend/.env)

Copy backend/.env.example to backend/.env and configure your MongoDB Atlas string:

env


PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/invest-platform
JWT_SECRET=your_super_secret_production_key
FRONTEND_URL=https://your-frontend-domain.com

Frontend Configuration (frontend/.env)

Copy frontend/.env.example to frontend/.env and configure:

env


VITE_API_URL=https://invest-platform-1.onrender.com
```

🐳 Running Locally


```text
1. Run the Backend
Navigate to the backend directory:
bash


cd backend
Install dependencies:
bash


npm install
Set up the .env file with your Mongo Atlas connection.
Run the development server (runs with nodemon):
bash


npm run dev


2. Run the Frontend
Navigate to the frontend directory:
bash


cd ../frontend
Install dependencies:
bash


npm install

Set up the .env file pointing to http://localhost:5000 (or your local backend address).
Run the development server (runs with Vite):
bash


npm run dev
```
