const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno desde .env

const secretKey = process.env.SECRET_KEY; // Obtener la clave secreta desde el archivo .env

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;