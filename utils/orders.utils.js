const fs = require('node:fs/promises');

// Leer todos los customers
async function getStoredOrders() {
    const rawFileContent = await fs.readFile('data/orders.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.orders ?? [];
}

// Escribir un nuevo customer
function storeOrders(orders) {
    return fs.writeFile('data/orders.json', JSON.stringify({ orders: orders || [] }));
}

exports.getStoredOrders = getStoredOrders;
exports.storeOrders = storeOrders;