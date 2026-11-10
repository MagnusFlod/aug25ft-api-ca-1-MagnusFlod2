## Todo API – Backend (Express + MySQL + Sequelize)



## Overview

This is a REST API application that utilizes ONLY backend.
It supports user authentication with JWT and allows users to manage their own todos and categories.
ALL requests must go via Postman or similar tools.

## Application Installation and Usage Instructions
Clone the repository:

git clone aug25ft-api-ca-1-MagnusFlod-1
cd aug25ft-api-ca-1-MagnusFlod-1

Install dependencies:

npm install

Start the application:

npm start



## Environment Variables
Create a .env file in the root directory and use the following:

HOST=localhost
ADMIN_USERNAME=ProjectAdmin
ADMIN_PASSWORD=P@ssw0rd
DATABASE_NAME=myTodo
DIALECT=mysql
PORT=3000
TOKEN_SECRET=your_secret_key


## Database Setup

Run the following in MySQL:

CREATE DATABASE myTodo;

(Optional: If needed)

GRANT ALL PRIVILEGES ON myTodo.* TO 'ProjectAdmin'@'localhost';
FLUSH PRIVILEGES;


## Authentication

JWT-based authentication is used

There are only two public routes here:

http://localhost:3000/users/signup
http://localhost:3000/users/login

ALL other routes require authentication with a Bearer Token


## API Endpoints
Here comes ALL API-endpoints. These can be used in Postman URL-field

# Users
POST /users/signup
POST /users/login

# Todos
GET http://localhost:3000/todos
GET http://localhost:3000/todos/all
GET http://localhost:3000/todos/deleted
POST http://localhost:3000/todos
PUT http://localhost:3000/todos
DELETE http://localhost:3000/todos

# Categories
GET http://localhost:3000/categories
POST http://localhost:3000/categories
PUT http://localhost:3000/categories
DELETE http://localhost:3000/categories

# Statuses
GET http://localhost:3000/statuses


## API Documentation

Swagger documentation is available at:

http://localhost:3000/doc


## Testing
Run tests using Jest and Supertest:

npm test


## Technologies Used
Node.js
Express.js
MySQL
Sequelize
JWT (jsonwebtoken)
Crypto (password hashing)
Jest & Supertest
Swagger (API documentation)