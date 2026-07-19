# HackRadar Monorepo

HackRadar is organized as two independently deployable applications:

- `frontend/` - Next.js web app
- `backend/` - Express, MongoDB, Passport, email, and Telegram API

The frontend and backend can be installed, run, and deployed separately.

## Folder Structure

```text
.
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── .env.local.example
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
├── .gitignore
└── LICENSE
```

## Local Development

Run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs on:

```text
http://localhost:5000/api
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hackradar
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_USER=
EMAIL_PASS=
TELEGRAM_BOT_TOKEN=
```

Do not commit real secrets.

## Deployment

### Frontend Service

Use `frontend` as the service root directory.

```text
Root Directory: frontend
Build Command: npm run build
Start Command: npm start
```

Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL, ending in `/api`.

### Backend Service

Use `backend` as the service root directory.

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Set all required backend environment variables in the hosting dashboard.

## Railway

Create two Railway services from the same repository:

1. Frontend service
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Add `NEXT_PUBLIC_API_URL`

2. Backend service
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add MongoDB, JWT, Google OAuth, email, Telegram, and frontend/client URL variables

## Render

Create two Render web services from the same repository:

1. Frontend
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add `NEXT_PUBLIC_API_URL`

2. Backend
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add required backend environment variables

## API

The backend exposes the API under:

```text
/api
```

Protected routes require:

```http
Authorization: Bearer <jwt>
```
