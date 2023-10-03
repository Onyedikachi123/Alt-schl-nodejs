const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { readFile, writeFile } = require('../helpers/storageHelper');

const router = express.Router();

let users = []; 

router.post('/register', async (req, res) => {
    const users = readFile('../data/users.json');
    
    const existingUser = users.find(u => u.username === req.body.username);
    if (existingUser) return res.status(409).send('Username already exists');

    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User(users.length + 1, req.body.username, hashedPassword, req.body.role);
    users.push(newUser);

    writeFile('../data/users.json', users);

   
    const apiKey = jwt.sign({ userId: newUser.id, role: newUser.role }, 'SECRET_KEY'); // Replace 'SECRET_KEY' with a secure secret
    
    res.status(201).json({ apiKey });
});


module.exports = router;
