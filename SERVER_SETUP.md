# millo Backend API Server Setup

## Overview

This document explains how to run the millo marketplace with the included backend API server.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
- **Homepage**: http://localhost:3000/index.html
- **Admin Dashboard**: http://localhost:3000/admin.html
- **Seller Dashboard**: http://localhost:3000/dashboard.html

## API Endpoints

The server provides RESTful API endpoints for all data tables:

### Base URL
```
http://localhost:3000/tables/{table}
```

### Supported Tables
- `users` - User accounts
- `products` - Product catalog
- `orders` - Customer orders
- `subscriptions` - Seller subscriptions

### API Operations

#### Get All Records
```
GET /tables/{table}?limit=100&offset=0
```

#### Get Single Record
```
GET /tables/{table}/{id}
```

#### Create Record
```
POST /tables/{table}
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

#### Update Record (Full)
```
PUT /tables/{table}/{id}
Content-Type: application/json

{
  "field1": "new_value1",
  "field2": "new_value2"
}
```

#### Update Record (Partial)
```
PATCH /tables/{table}/{id}
Content-Type: application/json

{
  "field1": "new_value1"
}
```

#### Delete Record
```
DELETE /tables/{table}/{id}
```

## Sample Data

The server comes pre-loaded with sample data:

### Users
- **Admin**: owner@millo.com / admin123
- **Seller 1**: seller1@example.com / seller123
- **Seller 2**: seller2@example.com / seller123

### Products
- 4 sample products across different categories
- Each with multiple color variants
- Active subscriptions

### Orders
- 2 sample orders with commission calculations

### Subscriptions
- 4 active subscriptions ($25/month each)

## Database Structure

The server uses an in-memory database. Data persists only during the server session.

### Users Table
```javascript
{
  id: string,
  email: string,
  password: string,
  full_name: string,
  role: 'admin' | 'seller' | 'customer',
  status: 'active' | 'suspended',
  created_at: ISO date string
}
```

### Products Table
```javascript
{
  id: string,
  seller_id: string,
  name: string,
  description: string,
  price: number,
  colors: string[],
  image_url: string,
  category: string,
  stock: number,
  status: 'active' | 'inactive',
  subscription_status: 'active' | 'expired',
  created_at: ISO date string
}
```

### Orders Table
```javascript
{
  id: string,
  customer_email: string,
  customer_name: string,
  product_id: string,
  product_name: string,
  color: string,
  quantity: number,
  price: number,
  total: number,
  seller_id: string,
  commission: number,
  seller_amount: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered',
  shipping_address: string,
  created_at: ISO date string
}
```

### Subscriptions Table
```javascript
{
  id: string,
  seller_id: string,
  product_id: string,
  amount: number,
  status: 'active' | 'expired' | 'cancelled',
  start_date: ISO date string,
  next_billing_date: ISO date string,
  created_at: ISO date string
}
```

## Server Configuration

### Port
Default: `3000`

To change the port, edit `server.js`:
```javascript
const PORT = 3000; // Change to your desired port
```

### CORS
CORS is enabled for all origins. For production, restrict origins in `server.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## Development Features

### Auto-ID Generation
IDs are automatically generated for new records.

### Timestamps
Created timestamps are automatically added to new records.

### Data Persistence
Data is stored in memory and resets when the server restarts.

## Production Considerations

⚠️ **Important**: This is a development server with in-memory storage.

For production deployment:

1. **Database**: Replace in-memory storage with PostgreSQL, MongoDB, or MySQL
2. **Authentication**: Implement JWT tokens and password hashing
3. **Validation**: Add input validation and sanitization
4. **Environment Variables**: Use `.env` for configuration
5. **HTTPS**: Enable SSL certificates
6. **Rate Limiting**: Add rate limiting middleware
7. **Logging**: Implement proper logging (Winston, Morgan)
8. **Error Handling**: Add comprehensive error handling
9. **Security**: Add helmet.js for security headers
10. **Session Management**: Implement proper session handling

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change the port in server.js
```

### Cannot Connect
- Ensure server is running: `npm start`
- Check console for error messages
- Verify port is not blocked by firewall

### API Returns 404
- Ensure correct table name (users, products, orders, subscriptions)
- Check URL format: `/tables/{table}` or `/tables/{table}/{id}`

### Data Not Persisting
- This is expected behavior with in-memory storage
- Data resets when server restarts
- For persistence, implement a real database

## Testing the API

### Using cURL

```bash
# Get all products
curl http://localhost:3000/tables/products

# Get single product
curl http://localhost:3000/tables/products/1

# Create new product
curl -X POST http://localhost:3000/tables/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "seller_id": "2",
    "description": "A great product",
    "colors": ["Red", "Blue"],
    "image_url": "https://example.com/image.jpg",
    "category": "Electronics",
    "stock": 10,
    "status": "active",
    "subscription_status": "active"
  }'

# Update product
curl -X PATCH http://localhost:3000/tables/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 45}'

# Delete product
curl -X DELETE http://localhost:3000/tables/products/1
```

### Using Browser DevTools

Open browser console on any page and run:

```javascript
// Get products
fetch('http://localhost:3000/tables/products')
  .then(r => r.json())
  .then(console.log);

// Create order
fetch('http://localhost:3000/tables/orders', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    customer_email: 'test@example.com',
    customer_name: 'Test Customer',
    product_id: '1',
    product_name: 'Premium Cotton T-Shirt',
    color: 'Blue',
    quantity: 2,
    price: 29.99,
    total: 59.98,
    seller_id: '2',
    commission: 8.99,
    seller_amount: 50.99,
    status: 'pending',
    shipping_address: '123 Test St'
  })
})
.then(r => r.json())
.then(console.log);
```

## Support

For issues or questions:
- Check console logs for errors
- Review API endpoint documentation
- Ensure all dependencies are installed
- Verify Node.js version (14+ recommended)

---

**millo Backend API** - Simple, Fast, Ready to Use 🚀
