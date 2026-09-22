# AI Capsule — AI Prompt Manager

A full-stack web application for saving, organising, and managing AI prompts and responses. Built with React (Vite + Tailwind CSS) on the frontend and Express + SQLite on the backend, secured with GitHub OAuth and JWT authentication.

***

## Deployed Application

- **Public URL:** [https://ai-capsule-e23s.onrender.com/]
- **Cloud Platform:** Render (free web service)

***

## Installation & Run Instructions

### Prerequisites

- Node.js >= 20.0.0 < 22.0.0
- npm

### 1. Clone the repository

    git clone https://github.com/HimanthaAmarathunga/AI-Capsule.git
    cd AI-Capsule

### 2. Install backend dependencies

    npm install

### 3. Install and build the frontend

    cd client
    npm install
    npm run build
    cd ..

### 4. Enviornment variables

    PORT=3001
    GITHUB_CLIENT_ID
    GITHUB_CLIENT_SECRET
    GITHUB_CALLBACK_URL
    JWT_SECRET
    NODE_ENV

### 5. Start the server

    npm start

The app will be available at http://localhost:3001.

***

## API Routes

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| GET | /api/health | No | Health check — returns { "status": "ok" } |
| GET | /auth/github | No | Redirects to GitHub OAuth |
| GET | /auth/github/callback | No | GitHub OAuth callback — issues JWT cookie |
| GET | /auth/logout | No | Clears the JWT cookie and redirects to / |
| GET | /auth/me | No | Returns the current authenticated user from JWT |
| GET | /api/capsules | Yes — JWT | Fetch all capsules owned by the authenticated user |
| POST | /api/capsules | Yes — JWT | Create a new capsule |
| PUT | /api/capsules/:id | Yes — JWT | Update a capsule owned by the user |
| DELETE | /api/capsules/:id | Yes — JWT | Delete a capsule owned by the user |

The React frontend communicates with Express via fetch() calls to the above routes. In development, Vite proxies /api and /auth requests to http://localhost:3001 via the proxy setting in vite.config.js. In production, both the frontend and backend are served from the same Express server — the built React app lives in client/dist and is served as static files.

***

## OAuth Provider, JWT Issuance, Storage and Verification

**Provider:** GitHub OAuth

**Flow:**

1. The user clicks "Login with GitHub", which calls GET /auth/github and redirects to GitHub's authorisation page.
2. GitHub redirects back to GET /auth/github/callback with a one-time authorisation code.
3. The backend exchanges the code for a GitHub access token, then fetches the user's GitHub profile (id, login, avatar_url).
4. The backend signs its own application JWT containing { user_id, username, avatar } using the JWT_SECRET environment variable, with a 7-day expiry.
5. The JWT is stored in a Secure, HttpOnly cookie named token — never in localStorage and never sent as a Bearer token.
6. Every protected route passes through the authenticateToken middleware in middleware/auth.js. This middleware reads the token cookie and calls jwt.verify() against JWT_SECRET. A missing cookie returns 401 Unauthorized: No token provided. An invalid or tampered token returns 401 Unauthorized: Invalid token. The authenticated user_id is always read from the verified JWT payload — it is never accepted from the request body or query string.

***

## Database Setup, User Ownership and Storage

**Database:** SQLite via better-sqlite3, stored as capsules.db in the project root.

**Initialisation:** The capsules table is created automatically on first run inside db.js using CREATE TABLE IF NOT EXISTS. No separate migration command is required.

**User ownership:** When a capsule is created via POST /api/capsules, the user_id field is set exclusively from req.user.user_id — the value decoded from the verified JWT. It is never taken from the request body. All READ, UPDATE, and DELETE queries include a WHERE id = ? AND user_id = ? clause, ensuring users can only access records they own.

**Persistence on Render:** Render's free web service uses an ephemeral filesystem. The capsules.db file is stored on the container's local disk and will be lost on every restart or redeployment. This is a known limitation of the free tier. For persistent storage, a managed database such as Render PostgreSQL would be required.

***

## Required cURL Security Tests

**Test 1 — No authentication**

    curl -i https://ai-capsule-e23s.onrender.com/api/capsules

Expected and obtained result:

    HTTP/2 401
    {"error":"Unauthorized: No token provided"}

**Test 2 — Fake / invalid JWT**

    curl -i -H "Cookie: token=fake-token-123" https://ai-capsule-e23s.onrender.com/api/capsules

Expected and obtained result:

    HTTP/2 401
    {"error":"Unauthorized: Invalid token"}

Both tests confirm that the backend requires a valid, server-signed JWT and does not grant access based solely on the presence of a cookie.

***

## Known Limitation

The SQLite database file (capsules.db) is stored on Render's ephemeral filesystem. Any capsules created in the deployed application will be permanently lost when Render restarts or redeploys the service. A persistent storage solution such as Render PostgreSQL would be required for a production-grade deployment.

***

## AI-Assisted Development

**AI tools used:** GitHub Copilot and Perplexity AI were used for this project for debugging, and configuration.

**Problem found and corrected in AI-generated code:**
The AI initially generated the res.cookie() call with secure: true set unconditionally. This caused the authentication cookie to be silently rejected in local development because localhost runs over HTTP, not HTTPS. The fix was to change this to secure: process.env.NODE_ENV === 'production', so the Secure flag is only applied when running on Render where HTTPS is enforced.

**How OAuth login, JWT verification and protected API behaviour were verified:**
OAuth login was verified by completing the full GitHub login flow and confirming that the token HttpOnly cookie appeared in the browser's DevTools under Application > Cookies. JWT verification was confirmed by running both cURL tests above, both of which returned 401 Unauthorized as required. Protected API behaviour was verified by logging in and successfully completing all four CRUD operations through the dashboard.

**How CRUD behaviour and user data ownership were verified:**
CREATE was verified by submitting the capsule form and confirming the new record appeared in the dashboard list. READ was verified by confirming that only capsules belonging to the logged-in user were returned by GET /api/capsules. UPDATE was verified by editing an existing capsule and confirming the changes were saved and reflected in the list. DELETE was verified by deleting a capsule and confirming it was removed without a page reload. User ownership was verified by inspecting routes/capsules.js, which always appends AND user_id = ? to every query using the value from the verified JWT — never from the request body.

**Implementation decision:**
I chose better-sqlite3 (synchronous SQLite) rather than an async ORM or PostgreSQL. Because this application has no concurrent write requirements and runs as a single Node.js process, synchronous database calls are simpler to reason about, require no connection pooling, and eliminate async/await boilerplate throughout the route handlers. The trade-off is ephemeral storage on Render's free tier, which is documented as the known limitation above.

***
