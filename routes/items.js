const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const { readFile, writeFile } = require('../helpers/storageHelper')

let items = [];

router.use((req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) return res.status(401).send('Access denied. No API key provided.');

    try {
        const userPayload = jwt.verify(apiKey, 'SECRET_KEY');
        req.user = userPayload;
        next();
    } catch (ex) {
        res.status(400).send('Invalid API key.');
    }
});

router.post('/', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    const items = readFile('../data/items.json');
    // const { name, price, size } = req.body;
    const newItem = new Item(items.length + 1, name, price, size);
    items.push(newItem);

    writeFile('../data/items.json', items);

    res.status(201).json(newItem);
});

router.get('/', (req, res) => {
    res.json(items);
});

router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');
    res.json(item);
});

router.put('/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');

    const { name, price, size } = req.body;
    item.name = name;
    item.price = price;
    item.size = size;

    res.json(item);
});

router.delete('/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).send('Item not found');

    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem);
});

module.exports = router;
