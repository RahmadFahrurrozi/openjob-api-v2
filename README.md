# OpenJob RESTful API (Version 2)

> **Final Capstone Project** for the **ASAH Scholarship Program (Back-End Developer Track)**, organized by **Dicoding Indonesia** in partnership with **GoTo**.

OpenJob RESTful API is a production-grade backend service built with Node.js and Express.js for modern job board platforms. Version 2 enhances the system with distributed caching via **Redis**, asynchronous message queuing via **RabbitMQ**, and document upload/storage capabilities via **Multer**.

---

## 📋 Prerequisites

Before setting up the project on your laptop, ensure you have the following installed:

1. **Node.js** (v22.x LTS or higher) & **npm**
2. **Git**
3. **Docker Desktop** (must be running for PostgreSQL, Redis, and RabbitMQ)

---

## 🚀 Laptop Setup Guide (From Clone to Running)

Follow these exact steps when pulling or cloning this repository on your laptop:

### 1. Clone the Repository
Open your terminal (PowerShell / Command Prompt / Bash) and clone the repo:
```bash
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd openjob-restful-api
```

*(If you already cloned it previously, simply run `git pull origin main` to fetch the latest changes).*

### 2. Install Project Dependencies
Install all required runtime and development dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create your local `.env` configuration file from the template:

* **Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
* **Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  ```

> **Note:** The default credentials in `.env.example` already match the local Docker container configurations. No additional edits are required unless customized.

### 4. Start Infrastructure Containers via Docker
Make sure **Docker Desktop is running**, then launch PostgreSQL, Redis, and RabbitMQ in background mode:
```bash
docker compose up -d
```

Verify that all 3 containers are up and healthy:
```bash
docker ps
```
You should see:
* `openjob-postgres` on port `5432`
* `openjob-redis` on port `6379`
* `openjob-rabbitmq` on ports `5672` (AMQP) and `15672` (Web Management UI)

### 5. Run Database Migrations
Execute all schema migrations to create the required tables in PostgreSQL:
```bash
npm run migrate:up
```

### 6. Start the Application Server
Run the Express development server with live reload enabled:
```bash
npm run start:dev
```
The server will be accessible at `http://localhost:3000`.

---

## 🛠️ Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the production server (`node src/server.js`) |
| `npm run start:dev` | Runs the development server with live reload (`nodemon`) |
| `npm run migrate:up` | Executes pending database migrations |
| `npm run migrate:down` | Rolls back the last applied migration |
| `npm run migrate:create <name>` | Creates a new migration file in `migrations/` |
| `npm run lint` | Inspects codebase with ESLint for syntax and style issues |
| `npm run lint:fix` | Automatically fixes ESLint-correctable issues |
| `npm run format` | Formats code with Prettier across `src/` |
| `npm test` | Cleans test database and executes Newman Postman tests |

---

## ⚙️ Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `HOST` | `localhost` | Application host address |
| `PORT` | `3000` | Application HTTP port |
| `PGUSER` | `postgres` | PostgreSQL username |
| `PGPASSWORD` | `postgrespassword` | PostgreSQL password |
| `PGDATABASE` | `openjob_db` | PostgreSQL database name |
| `PGHOST` | `localhost` | PostgreSQL host |
| `PGPORT` | `5432` | PostgreSQL port |
| `REDIS_HOST` | `localhost` | Redis host address for caching |
| `RABBITMQ_HOST` | `localhost` | RabbitMQ server host address |
| `RABBITMQ_PORT` | `5672` | RabbitMQ AMQP port |
| `RABBITMQ_USER` | `guest` | RabbitMQ username |
| `RABBITMQ_PASSWORD` | `guest` | RabbitMQ password |
| `ACCESS_TOKEN_KEY` | *(Secret String)* | Secret key for JWT access tokens |
| `REFRESH_TOKEN_KEY` | *(Secret String)* | Secret key for JWT refresh tokens |
| `ACCESS_TOKEN_AGE` | `10800` | Token expiration in seconds (3 hours) |
| `MAIL_HOST` | `smtp.mailtrap.io` | SMTP host for email notifications |
| `MAIL_PORT` | `2525` | SMTP port |
| `MAIL_USER` | `your_smtp_user` | SMTP user credential |
| `MAIL_PASSWORD` | `your_smtp_password` | SMTP password credential |

---

## 📦 Container Services Management

* **Stop containers without losing database data:**
  ```bash
  docker compose down
  ```
* **Restart containers:**
  ```bash
  docker compose restart
  ```
* **Access RabbitMQ Web Management Dashboard:**
  Open `http://localhost:15672` in your browser.
  Default login: Username `guest`, Password `guest`.

---

## 🧪 Testing with Postman & Newman

Import the Postman Collection and Environment located in `OpenJob RESTful API V2 Test/`:
1. `OpenJob API.postman_environment.json`
2. `[271] OpenJob API Test V2.postman_collection.json`

Ensure your environment active target is set to **OpenJob API** and execute required test folders.

