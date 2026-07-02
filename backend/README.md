# HackRadar Backend

Express, MongoDB, and Passport backend for the HackRadar MVP.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## API Base

`http://localhost:5000/api`

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /user/profile`
- `PUT /user/profile`
- `GET /hackathons`
- `GET /hackathons/:id`
- `GET /bookmarks`
- `POST /bookmarks`
- `DELETE /bookmarks/:id`
- `GET /alerts`
- `POST /alerts`
- `PUT /alerts/:id`
- `DELETE /alerts/:id`
- `GET /health`

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```
