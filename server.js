const express = require('express');
const path = require('path');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users')

const app = express();

app.use(express.static('public'));
app.use(express.json()); 

app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter)

app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.params.page));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
