# Grocery App Backend

A high-performance backend for a grocery delivery application built with Fastify, Socket.IO, JWT authentication, and MongoDB. Includes an admin panel powered by AdminJS.

## Features

### Authentication
- ✅ User registration & login (JWT)
- ✅ Delivery partner registration & login (JWT)
- ✅ Role-based access control
- ✅ Secure password hashing

### Order Management
- 🛒 Create new orders
- 🔄 Real-time order status updates (Socket.IO)
- 📍 Live delivery partner tracking
- 📦 Order history and details

### Admin Panel (AdminJS)
- 👔 Comprehensive dashboard
- 👥 User management
- 🚚 Delivery partner management
- 📊 Order analytics
- ⚙️ System configuration

## Technologies Used

- **Framework**: Fastify (High-performance Node.js framework)
- **Realtime**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB (with Mongoose ODM)
- **Admin Panel**: AdminJS
- **Validation**: Fastify schemas
- **Testing**: Tape (or your preferred testing framework)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/grocery_app_backend.git
cd grocery_app_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/grocery_app` |
| `JWT_SECRET` | Secret for JWT tokens | `your_jwt_secret` |
| `ADMINJS_COOKIE_SECRET` | Secret for AdminJS sessions | `your_adminjs_secret` |
| `ADMINJS_EMAIL` | Default admin email | `admin@example.com` |
| `ADMINJS_PASSWORD` | Default admin password | `securepassword` |

## API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/delivery/register` - Delivery partner registration
- `POST /api/auth/delivery/login` - Delivery partner login

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status
- `GET /api/orders/user/:userId` - Get user's order history

### Realtime Updates
- Socket.IO events:
  - `OrderCreated`
  - `OrderStatusUpdated`
  - `DeliveryLocationUpdated`

## Admin Panel

Access the admin panel at `http://localhost:3000/admin` after starting the server.

Default admin credentials (change after first login):
- Email: `admin@example.com`
- Password: `securepassword`

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start in production mode:
```bash
npm start
```

For production deployment, consider using:
- PM2 or similar process manager
- MongoDB Atlas for database
- Reverse proxy (Nginx, Apache)
- HTTPS with Let's Encrypt

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub or contact maintainers.
