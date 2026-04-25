require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/states', require('./routes/states'))

// routes
app.get('/', (req, res) => {res.send('States API running');});

// 404 catch all
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});