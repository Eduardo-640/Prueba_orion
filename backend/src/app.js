const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
const verifyToken = require('./middleware/auth.middleware');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas públicas
app.use("/api/auth", require('./routes/auth.routes'));

// Rutas protegidas
app.use("/api/inmobiliaria", verifyToken, require('./routes/inmobiliaria.routes'));

app.use("/api/venta", verifyToken, require('./routes/venta.routes'));

module.exports = app;
