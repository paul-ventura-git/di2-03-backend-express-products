const express = require("express");

const productsRoutes = require("./routes/products.routes");
const customersRoutes = require("./routes/customers.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());

app.use("/products", productsRoutes);
app.use("/customers", customersRoutes);
app.use("/orders", ordersRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080...");
});