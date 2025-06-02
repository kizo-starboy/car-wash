# Car Wash Service Management System

A comprehensive web application for managing car wash services, built with React.js frontend and Node.js backend.

## Features

- 🚗 **Car Management** - Register and manage customer cars
- 📦 **Package Management** - Create and manage service packages
- 📋 **Service Records** - Track all car wash services
- 💰 **Payment Tracking** - Record and manage payments
- 📊 **Reports & Analytics** - Generate comprehensive reports
- 👤 **User Authentication** - Secure login system

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- MySQL database
- Session-based authentication
- RESTful API design

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn** package manager

## Quick Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd car-wash
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run setup
npm run dev
```

The `npm run setup` command will automatically:
- Create the MySQL database (`cwsms`)
- Create all required tables
- Insert sample data
- Set up default admin user

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 5. Default Login
- **Username:** admin
- **Password:** admin123

## Manual Database Setup

If the automatic setup doesn't work, you can set up the database manually:

### Option 1: Using npm scripts
```bash
cd backend
npm run reset-db    # Drops and recreates everything
npm run setup-db    # Creates database and tables
```

### Option 2: Using MySQL directly
1. Open MySQL command line or phpMyAdmin
2. Create database: `CREATE DATABASE cwsms;`
3. Import the SQL file: `backend/cwsms.sql`

### Option 3: Using the setup script
```bash
cd backend
node auto_setup.js          # Normal setup
node auto_setup.js --reset  # Reset everything
```

## Project Structure

```
car-wash/
├── backend/
│   ├── routes/           # API routes
│   ├── auto_setup.js     # Database setup script
│   ├── server.js         # Main server file
│   ├── db.js            # Database connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Add new car
- `PUT /api/cars/:plateNumber` - Update car
- `DELETE /api/cars/:plateNumber` - Delete car

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Add new package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Service Records
- `GET /api/services` - Get all service records
- `POST /api/services` - Add new service record
- `PUT /api/services/:id` - Update service record
- `DELETE /api/services/:id` - Delete service record

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Add new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Database Schema

### Tables
1. **Users** - System users
2. **Car** - Customer cars
3. **Package** - Service packages
4. **ServicePackage** - Service records
5. **Payment** - Payment records

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Make sure MySQL is running
   - Check database credentials in `backend/db.js`
   - Ensure database `cwsms` exists

2. **"Package table doesn't exist" Error**
   - Run: `cd backend && npm run setup`
   - Or manually run: `node auto_setup.js`

3. **Frontend Can't Connect to Backend**
   - Make sure backend is running on port 5000
   - Check CORS settings in `backend/server.js`

4. **Port Already in Use**
   - Backend: Change port in `backend/server.js`
   - Frontend: Change port in `frontend/vite.config.js`

### Reset Everything
If you want to start fresh:
```bash
cd backend
npm run reset-db
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues, please:
1. Check the troubleshooting section
2. Ensure all prerequisites are installed
3. Run the setup script again
4. Check the console for error messages
