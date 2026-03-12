const md5 = require("blueimp-md5");
const { getStoredProducts, storeProducts } = require("../utils/products.utils");

exports.getProducts = async (req, res) => {
    const products = await getStoredProducts();
    res.json({ products });
};

exports.getProduct = async (req, res) => {
    const products = await getStoredProducts();
    const product = products.find(p => p.id === req.params.id);
    res.json({ product });
};

exports.createProduct = async (req, res) => {
    const products = await getStoredProducts();

    const newProduct = {
        id: md5(req.body.description + Date.now()),
        ...req.body
    };

    await storeProducts([newProduct, ...products]);

    res.status(201).json({
        message: "Stored new product.",
        product: newProduct
    });
};

exports.updateProduct = async (req, res) => {
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
}

exports.deleteProduct = async (req, res) => {
    const productsData = await getStoredProducts();
    const products = productsData
        .filter(item => item.id !== req.params.id);
    await storeProducts(products);
    res.status(204).send();
}