# TechMart E-commerce Web Application

A full-stack e-commerce web application built with modern web technologies. This project consists of a Node.js/Express backend, a frontend application, and MongoDB database, all containerized using Docker.

## 🚀 Features

- RESTful API backend with Express.js
- MongoDB database for data persistence
- Docker containerization for easy deployment
- Product management system
- User authentication and authorization
- Shopping cart functionality
- Order management

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin resource sharing
- Environment variables with dotenv

### Frontend
- Modern web framework
- Responsive design
- User-friendly interface

### Infrastructure
- Docker and Docker Compose
- MongoDB 6.0
- Containerized deployment

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn (for local development)
- MongoDB (if running locally)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd techmart-webapp
   ```

2. Using Docker (Recommended):
   ```bash
   docker-compose up --build
   ```
   This will start all services:
   - Frontend on http://localhost:8080
   - Backend API on http://localhost:5000
   - MongoDB on port 27017

3. For local development:

   Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/ecommerceDB
PORT=5000
```

## 📁 Project Structure

```
techmart-webapp/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── index.js
│   └── package.json
├── frontend/
│   └── [frontend files]
├── docker-compose.yml
└── README.md
```

## 🛠️ Available Scripts

### Backend
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run product-seed`: Seed the database with product data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries 
