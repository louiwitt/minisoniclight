# MiniSonicLight

MiniSonicLight is an interactive web application that lets users create, save and modify drawings, developed as part of a technical exercise for IRCAM.

## Stack

* **Frontend:** Vue 3, TypeScript, Vite
* **Backend:** Node.js, TypeScript, Express
* **Database:** SQLite (`better-sqlite3`)
* **Drawing:** HTML Canvas API

## Features

### Implemented

* User identification
* Canvas drawing with mouse
* REST API to create, retrieve and update drawings
* SQLite persistence for users and drawings

### Coming next

* Connect the canvas to the API
* Restore saved drawings
* Admin interface
* Web Audio API


## API

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| `POST` | `/login`   | Identify or create a user   |
| `POST` | `/drawing` | Create a drawing            |
| `GET`  | `/drawing` | Retrieve the user's drawing |
| `PUT`  | `/drawing` | Update the user's drawing   |

User identification is currently handled through the `X-User-Id` HTTP header. This is a simplified mechanism for the exercise and is not intended for production use.

## Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on the Vite development server, typically `http://localhost:5173`.
