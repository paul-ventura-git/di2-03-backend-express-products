const md5 = require("blueimp-md5");
const { getStoredOrders, storeOrders } = require("../utils/orders.utils");

exports.getOrders = async (req, res) => {
    const orders = await getStoredOrders();
    res.json({ orders });
};

exports.getOrder = async (req, res) => {
    const orders = await getStoredOrders();
    const order = orders.find(p => p.id === req.params.id);
    res.json({ order });
};

exports.createOrder = async (req, res) => {
    const orders = await getStoredOrders();

    const newOrder = {
        id: md5(req.body.description + Date.now()),
        ...req.body
    };

    await storeOrders([newOrder, ...orders]);

    res.status(201).json({
        message: "Stored new order.",
        order: newOrder
    });
};


exports.updateOrder = async (req, res) => {
    const ordersData = await getStoredOrders();
    const orderIndex = ordersData.findIndex(item => item.id === req.params.id);

    const order =
        ordersData.find(
            item => item.id === req.params.id
        );
    if (!order) return res.status(404).send('This order was not found.');

    order.code          = req.body.code;
    order.timestamp     = req.body.timestamp;
    order.detail        = req.body.detail;
    // La capa de aplicación ya se encarga de generar el array con los objetos correspondientes a cada fila del "Detalle"
    order.totalAmount   = req.body.totalAmount;

    ordersData[orderIndex] = order;

    await storeOrders(ordersData);
    res.json(order);
}

exports.deleteOrder = async (req, res) => {
    const ordersData = await getStoredOrders();
    const orders = ordersData
        .filter(item => item.id !== req.params.id);
    await storeOrders(orders);
    res.status(204).send();
}