const express = require('express');
const bodyParser = require('body-parser');
const md5 = require("blueimp-md5");

const { getStoredProducts, storeProducts } = require('./data/products');
const {getStoredCustomers, storeCustomers } = require("./data/customers");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rutas para PRODUCTS
app.get('/products', async (req, res) => {
  const storedProducts = await getStoredProducts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ products: storedProducts });
  res.status(200);
});

app.get('/products/:id', async (req, res) => {
  const storedProducts = await getStoredProducts();
  const product = storedProducts.find((product) => product.id === req.params.id);
  res.json({ product });
});

app.post('/products', async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productData = req.body;
  const newProduct = {
    id: md5(req.body.description+Date.now()),
    ...productData
  };
  const updatedProducts = [newProduct, ...existingProducts];
  await storeProducts(updatedProducts);
  res.status(201).json({ message: 'Stored new product.', product: newProduct });
});

// Rutas para CUSTOMERS
app.get('/customers', async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ customers: storedCustomers });
  res.status(200);
});

app.get('/customers/:id', async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  const customer = storedCustomers.find((customer) => customer.id === req.params.id);
  res.json({ customer });
});

app.post('/customers', async (req, res) => {
  const existingCustomers = await getStoredCustomers();
  const customersData = req.body;
  const newCustomer = {
    id: md5(req.body.description+Date.now()),
    ...customersData
  };
  const updatedCustomers = [newCustomer, ...existingCustomers];
  await storeCustomers(updatedCustomers);
  res.status(201).json({ message: 'Stored new customer.', customer: newCustomer });
});

console.log("Listening on port 8080...")
app.listen(8080);