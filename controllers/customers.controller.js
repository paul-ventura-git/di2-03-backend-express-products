const md5 = require("blueimp-md5");
const { getStoredCustomers, storeCustomers } = require("../utils/customers.utils");

exports.getCustomers = async (req, res) => {
    const customers = await getStoredCustomers();
    res.json({ customers });
};

exports.getCustomer = async (req, res) => {
    const customers = await getStoredCustomers();
    const customer = customers.find(p => p.id === req.params.id);
    res.json({ customer });
};

exports.createCustomer = async (req, res) => {
    const customers = await getStoredCustomers();

    const newCustomer = {
        id: md5(req.body.description + Date.now()),
        ...req.body
    };

    await storeCustomers([newCustomer, ...customers]);

    res.status(201).json({
        message: "Stored new customer.",
        customer: newCustomer
    });
};

exports.updateCustomer = async (req, res) => {
    const customersData = await getStoredCustomers();
    const customerIndex = customersData.findIndex(item => item.id === req.params.id);

    const customer =
        customersData.find(
            item => item.id === req.params.id
        );
    if (!customer) return res.status(404).send('This customer was not found.');

    customer.name       = req.body.name;
    customer.email      = req.body.email;
    customer.phone      = req.body.phone;
    customer.address    = req.body.address;

    customersData[customerIndex] = customer;

    await storeCustomers(customersData); // Overwriting
    res.json(customer);
}

exports.deleteCustomer = async (req, res) => {
    const customersData = await getStoredCustomers();
    const customers = customersData
        .filter(item => item.id !== req.params.id);
    await storeCustomers(customers); // Overwriting
    res.status(204).send();
}