const express = require('express');
const bodyParser = require('body-parser');
const md5 = require("blueimp-md5");

const { getStoredProducts, storeProducts } = require('./data/products');
const {getStoredCustomers, storeCustomers } = require("./data/customers");
const {getStoredPublications, storePublications } = require("./data/publications");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
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

app.put('/products/:id', async (req, res) => {
  const productsData = await getStoredProducts();
  const productIndex = productsData.findIndex(item => item.id === req.params.id);

  const product =
      productsData.find(
          item => item.id === req.params.id
      );
  if (!product) return res.status(404).send('This product was not found.');

  product.title        = req.body.title;
  product.description  = req.body.description;
  product.category     = req.body.category;
  product.price        = req.body.price;
  product.discount     = req.body.discount;
  product.rating       = req.body.rating;
  product.stock        = req.body.stock;
  product.brand        = req.body.brand;
  product.weight       = req.body.weight;

  productsData[productIndex] = product;

  await storeProducts(productsData);
  res.json(product);
});

app.delete('/products/:id', async (req, res) => {
  const productsData = await getStoredProducts();
  const products = productsData
      .filter(item => item.id !== req.params.id);
  await storeProducts(products);
  res.status(204).send();
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
  const customerData = req.body;
  const newCustomer = {
    id: md5(req.body.email+Date.now()),
    ...customerData
  };
  const updatedCustomers = [newCustomer, ...existingCustomers];
  await storeCustomers(updatedCustomers);
  res.status(201).json({ message: 'Stored new customer.', customer: newCustomer });
});

app.put('/customers/:id', async (req, res) => {
  const customerData = await getStoredCustomers();
  const customerIndex = customerData.findIndex(item => item.id === req.params.id);

  const customer =
      customerData.find(
          item => item.id === req.params.id
      );
  if (!customer) return res.status(404).send('This customer was not found.');

  customer.name     = req.body.name;
  customer.phone    = req.body.phone;
  customer.email    = req.body.email;
  customer.address  = req.body.address;

  customerData[customerIndex] = customer;

  await storeCustomers(customerData);
  res.json(customer);
});

app.delete('/customers/:id', async (req, res) => {
  const customerData = await getStoredCustomers();
  customers = customerData
      .filter(item => item.id !== req.params.id);
  await storeCustomers(customers);
  res.status(204).send();
});

// Rutas para PUBLICACIONES
app.get('/publications', async (req, res) => {
  const storedPublications = await getStoredPublications();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ publications: storedPublications });
  res.status(200);
});

app.get('/publications/:id', async (req, res) => {
  const storedPublications = await getStoredPublications();
  const publication = storedPublications.find((publication) => publication.id === req.params.id);
  res.json({ publication });
});

app.post('/publications', async (req, res) => {
  const existingPublications = await getStoredPublications();
  const publicationData = req.body;
  const newPublication = {
    id: md5(req.body.body+Date.now()),
    ...publicationData
  };
  const updatedPublications = [newPublication, ...existingPublications];
  await storePublications(updatedPublications);
  res.status(201).json({ message: 'Stored new publication.', publication: newPublication });
});

app.put('/publications/:id', async (req, res) => {
  const publicationData = await getStoredPublications();
  const publicationIndex = publicationData.findIndex(item => item.id === req.params.id);

  const publication =
      publicationData.find(
          item => item.id === req.params.id
      );
  if (!publication) return res.status(404).send('This publication was not found.');

  publication.title   = req.body.title;
  publication.body    = req.body.body;
  publication.views   = req.body.views;
  publication.userId  = req.body.userId;

  publicationData[publicationIndex] = publication;

  await storePublications(publicationData);
  res.json(publication);
});

app.delete('/customers/:id', async (req, res) => {
  const customerData = await getStoredCustomers();
  customers = customerData
      .filter(item => item.id !== req.params.id);
  await storeCustomers(customers);
  res.status(204).send();
});


console.log("Listening on port 8080...")
app.listen(8080);