-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS todo_users;

CREATE TABLE todo_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  task_name TEXT,
  description VARCHAR NOT NULL,
  bought BOOLEAN NOT NULL DEFAULT(true),
  FOREIGN KEY (user_id) REFERENCES todo_users(id)
)
