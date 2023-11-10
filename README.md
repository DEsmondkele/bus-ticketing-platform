# Bus Ticketing Platform API

This project implements a set of API functions for a Bus Ticketing Platform, similar to a tap-and-pay system. Users can perform various actions through these APIs, including creating accounts, purchasing tickets, crediting accounts, and more.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Local Development](#local-development)
- [Seed Data](#seed-data)
- [API Documentation](#api-documentation)

## Technologies Used

- Node.js with Express.js (TypeScript)
- MySQL
- Knex.js for database migrations
- Docker for containerization

## Database Setup

The project utilizes a MySQL database. You can configure the database connection in the `.env` file. Make sure to create a database and configure your connection details.

```plaintext
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
To set up the database schema and run migrations, use the following commands:

bash
Copy code
# Install dependencies
npm install

# Run migrations to create the database schema
npx knex migrate:latest
Project Structure
The project is structured as follows:

src/ - Source code
db/ - Database migrations and seeds
tests/ - Test files
API Endpoints
POST /api/v1/users/register: Create a new user account.
POST /api/v1/users/login: Log in and create a bus ticket ID for the user.
POST /api/v1/users/credit/:id: Credit a user's bus ticket account (payment gateway not implemented).
POST /api/v1/tickets/pay/:id: Pay for a ticket via a user's account.
GET /api/v1/users/balance/:id: View the current account balance for a user.
GET /api/v1/users/transactions/:id: View all user transactions (in and out) and query per date/time period.
POST /api/v1/users/transfer/:fromId/:toId: Send credit from one user's account to another user's account.
Testing
To run tests, use the following command:

bash
Copy code
npm test
Local Development
To run the application locally for development, use the following commands:

bash
Copy code
# Start the development server
npm start

# Application will be available at http://localhost:3000
Seed Data
If you need initial data to test the APIs, you can run seed files. Use the following command:

bash
Copy code
npx knex seed:run
API Documentation
For detailed API documentation, please refer to the https://restless-meteor-90462.postman.co/workspace/My-Workspace~13df0ace-950f-4e08-8d41-11b427b78cc7/collection/16793144-805dbdf6-e095-45b5-a4bf-52e85f8352a9?action=share&creator=16793144&active-environment=16793144-160c1751-5731-4f7c-a811-de6118d997be. You can import the collection into Postman for easy testing and exploration of the API endpoints.