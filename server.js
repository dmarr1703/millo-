const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory database
let database = {
    users: [
        {
            id: '1',
            email: 'owner@millo.com',
            password: 'admin123',
            full_name: 'Platform Owner',
            role: 'admin',
            status: 'active',
            created_at: new Date('2024-01-01').toISOString()
        },
        {
            id: '2',
            email: 'seller1@example.com',
            password: 'seller123',
            full_name: 'John Seller',
            role: 'seller',
            status: 'active',
            created_at: new Date('2024-01-15').toISOString()
        },
        {
            id: '3',
            email: 'seller2@example.com',
            password: 'seller123',
            full_name: 'Jane Merchant',
            role: 'seller',
            status: 'active',
            created_at: new Date('2024-02-01').toISOString()
        }
    ],
    products: [
        {
            id: '1',
            seller_id: '2',
            name: 'Premium Cotton T-Shirt',
            description: 'Comfortable, breathable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
            price: 29.99,
            colors: ['Red', 'Blue', 'Black', 'White'],
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            category: 'Clothing',
            stock: 50,
            status: 'active',
            subscription_status: 'active',
            created_at: new Date('2024-02-15').toISOString()
        },
        {
            id: '2',
            seller_id: '2',
            name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
            price: 149.99,
            colors: ['Black', 'Silver', 'Blue'],
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            category: 'Electronics',
            stock: 25,
            status: 'active',
            subscription_status: 'active',
            created_at: new Date('2024-03-01').toISOString()
        },
        {
            id: '3',
            seller_id: '3',
            name: 'Leather Messenger Bag',
            description: 'Genuine leather messenger bag with multiple compartments. Perfect for work or travel.',
            price: 199.99,
            colors: ['Brown', 'Black'],
            image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
            category: 'Accessories',
            stock: 15,
            status: 'active',
            subscription_status: 'active',
            created_at: new Date('2024-03-10').toISOString()
        },
        {
            id: '4',
            seller_id: '3',
            name: 'Smart Fitness Watch',
            description: 'Track your fitness goals with this advanced smartwatch. Heart rate monitor, GPS, and waterproof.',
            price: 249.99,
            colors: ['Black', 'Rose Gold', 'Silver'],
            image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            category: 'Electronics',
            stock: 30,
            status: 'active',
            subscription_status: 'active',
            created_at: new Date('2024-03-20').toISOString()
        }
    ],
    orders: [
        {
            id: '1',
            customer_email: 'customer1@example.com',
            customer_name: 'Alice Customer',
            product_id: '1',
            product_name: 'Premium Cotton T-Shirt',
            color: 'Blue',
            quantity: 2,
            price: 29.99,
            total: 59.98,
            seller_id: '2',
            commission: 8.99,
            seller_amount: 50.99,
            status: 'delivered',
            shipping_address: '123 Main St, Toronto, ON M5V 1A1',
            created_at: new Date('2024-03-25').toISOString()
        },
        {
            id: '2',
            customer_email: 'customer2@example.com',
            customer_name: 'Bob Buyer',
            product_id: '2',
            product_name: 'Wireless Bluetooth Headphones',
            color: 'Black',
            quantity: 1,
            price: 149.99,
            total: 149.99,
            seller_id: '2',
            commission: 22.50,
            seller_amount: 127.49,
            status: 'shipped',
            shipping_address: '456 Oak Ave, Vancouver, BC V6B 2K9',
            created_at: new Date('2024-03-28').toISOString()
        }
    ],
    subscriptions: [
        {
            id: '1',
            seller_id: '2',
            product_id: '1',
            amount: 25,
            status: 'active',
            start_date: new Date('2024-02-15').toISOString(),
            next_billing_date: new Date('2024-04-15').toISOString(),
            created_at: new Date('2024-02-15').toISOString()
        },
        {
            id: '2',
            seller_id: '2',
            product_id: '2',
            amount: 25,
            status: 'active',
            start_date: new Date('2024-03-01').toISOString(),
            next_billing_date: new Date('2024-04-01').toISOString(),
            created_at: new Date('2024-03-01').toISOString()
        },
        {
            id: '3',
            seller_id: '3',
            product_id: '3',
            amount: 25,
            status: 'active',
            start_date: new Date('2024-03-10').toISOString(),
            next_billing_date: new Date('2024-04-10').toISOString(),
            created_at: new Date('2024-03-10').toISOString()
        },
        {
            id: '4',
            seller_id: '3',
            product_id: '4',
            amount: 25,
            status: 'active',
            start_date: new Date('2024-03-20').toISOString(),
            next_billing_date: new Date('2024-04-20').toISOString(),
            created_at: new Date('2024-03-20').toISOString()
        }
    ]
};

// Helper function to generate ID
function generateId(table) {
    const ids = database[table].map(item => parseInt(item.id));
    return (Math.max(...ids, 0) + 1).toString();
}

// RESTful API Routes

// GET all records from a table
app.get('/tables/:table', (req, res) => {
    const { table } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const start = parseInt(offset);
    const end = start + parseInt(limit);
    const data = database[table].slice(start, end);
    
    res.json({
        data,
        total: database[table].length,
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
});

// GET single record by ID
app.get('/tables/:table/:id', (req, res) => {
    const { table, id } = req.params;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const record = database[table].find(item => item.id === id);
    
    if (!record) {
        return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(record);
});

// POST create new record
app.post('/tables/:table', (req, res) => {
    const { table } = req.params;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const newRecord = {
        id: generateId(table),
        ...req.body,
        created_at: new Date().toISOString()
    };
    
    database[table].push(newRecord);
    res.status(201).json(newRecord);
});

// PUT update entire record
app.put('/tables/:table/:id', (req, res) => {
    const { table, id } = req.params;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const index = database[table].findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }
    
    const updatedRecord = {
        ...database[table][index],
        ...req.body,
        id // Preserve the ID
    };
    
    database[table][index] = updatedRecord;
    res.json(updatedRecord);
});

// PATCH partial update
app.patch('/tables/:table/:id', (req, res) => {
    const { table, id } = req.params;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const index = database[table].findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }
    
    database[table][index] = {
        ...database[table][index],
        ...req.body,
        id // Preserve the ID
    };
    
    res.json(database[table][index]);
});

// DELETE record
app.delete('/tables/:table/:id', (req, res) => {
    const { table, id } = req.params;
    
    if (!database[table]) {
        return res.status(404).json({ error: 'Table not found' });
    }
    
    const index = database[table].findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }
    
    database[table].splice(index, 1);
    res.status(204).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 millo API Server running on http://localhost:${PORT}`);
    console.log(`📊 Database initialized with sample data`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}/index.html`);
    console.log(`\n📝 Demo Accounts:`);
    console.log(`   Admin: owner@millo.com / admin123`);
    console.log(`   Seller: seller1@example.com / seller123`);
});
