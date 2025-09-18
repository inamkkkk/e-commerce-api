# E-commerce API

This is a simple e-commerce API built with Node.js, Express, and MongoDB.

## Features

- Product listings
- Shopping cart functionality

## Folder Structure


├── server.js          # Main entry point
├── routes/             # API routes
│   ├── productRoutes.js
│   └── cartRoutes.js
├── controllers/
│   ├── productController.js
│   └── cartController.js
├── models/
│   ├── Product.js
│   └── Cart.js
├── middlewares/
│   └── errorMiddleware.js
├── utils/
│   └── db.js          # Database connection
└── package.json


## Installation

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Configure MongoDB connection in `utils/db.js`.
4.  Run the server: `npm start`

## Endpoints

### Products

*   `GET /api/products` - Get all products
*   `GET /api/products/:id` - Get a single product

### Cart

*   `GET /api/cart/:userId` - Get user cart
*   `POST /api/cart/:userId` - Add product to cart
*   `PUT /api/cart/:userId` - Update product in cart
*   `DELETE /api/cart/:userId/:productId` - Delete product from cart

## Dependencies

*   express
*   mongoose
*   dotenv
