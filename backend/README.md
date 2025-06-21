# API

This is the backend API, built using **FastAPI**, **SQLAlchemy**, and **Alembic**. It provides a foundational authentication and user management system including users, roles, and organizations.


## Setup Instructions

### 1. Clone the Repository
```bash

```

### 2. Create and Activate a Virtual Environment

Note: use python or python3 and pip or pip3 depending on installation

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

pip3 install -r requirements.txt

Environment Configuration

Create a .env file in the project root and add:

```
ENV_NAME=development
SECRET_KEY=a9fwJvn9g7r-Q1pEx7RvOjPwP0K6kJcVHHUUTyMUS4b5WHoKN1yhzA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
DB_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/mydb
FRONTEND_URL=http://localhost:5173
DEBUG=True
```

Change credentials for the database as per your local setup.


### 4. Database Setup
#### 4.1. Create the PostgreSQL Database

Alembic handles schema creation but not the database itself. You must manually create the database:

```bash
psql -U postgres
CREATE DATABASE mydb;
```

Or use pgAdmin, Docker, or your preferred PostgreSQL client.



#### 4.2. Run Migrations

Once the DB exists, run:

```bash
alembic upgrade head
```

This creates the required tables: users, organizations, roles, user_roles.


### 5. Running the Server

```bash
fastapi dev
```

Now visit: http://localhost:8000/docs for the interactive Swagger UI.


## Testing Instructions:

    Setup the test database following step 4 above.

### create a `.env.testing` file.
This file is used for setting testing environment variables. The app mainly needs the following variables setup:

```bash
TEST_DB_URL=postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@localhost:5432/{TEST_DB_NAME}
TEST_DB_USER={TEST_USER}
USER_DEFAULT_PASSWORD=P@ssw0rd

```

```bash
ENV_NAME=testing pytest -s
```


#### Common Errors & Fixes
Permission denied for schema public

```bash
GRANT ALL ON SCHEMA public TO user;
```

Target database is not up to date

```bash
alembic upgrade head
```

psycopg2.errors.InvalidSchemaName

    You likely need to recreate or reset the schema.

database "mydb" is being accessed by other users

Terminate other sessions:

```bash
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'mydb';
```

Notes

    Use email as the primary login field (not username).

