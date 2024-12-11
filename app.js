const express = require('express');
const bodyParser = require('body-parser');
const md5 = require("blueimp-md5");

const { getStoredProducts, storedProducts } = require('./data/products');

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

app.get('/products', async (req, res) => {
  const storedProducts = await getStoredProducts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ products: storedProducts });
  res.status(200);
});

app.get('/products/:id', async (req, res) => {
  const storedProducts = await getStoredProducts();
  console.log(storedProducts);
  console.log(req.params.id);
  const product = storedProducts.find((product) => product.id == req.params.id);
  console.log(product);
  res.json({ product });
});

app.post('/products', async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productData = req.body;
  const newProduct = {
    id: md5(req.body.description+Date.now),
    ...productData
  };
  const updatedProducts = [newProduct, ...existingProducts];
  await storedProducts(updatedProducts);
  res.status(201).json({ message: 'Stored new post.', post: newProduct });
});

console.log("Listening on port 8080...")
app.listen(8080);