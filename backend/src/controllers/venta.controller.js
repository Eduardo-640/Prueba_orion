const fs = require('fs');
const path = require('path');

const ventaCtrl = {};
const ventasPath = path.join(__dirname, '../data/ventas.json');

// Función para leer el archivo JSON
const readDatabase = (filePath) => {
    if (!fs.existsSync(filePath)) {
        // Crea el archivo con la clave correcta si no existe
        fs.writeFileSync(filePath, JSON.stringify({ ventas: [] }, null, 2));
    }

    const data = fs.readFileSync(filePath, 'utf8');
    // Si el archivo está vacío, inicialízalo con la clave correcta
    if (!data.trim()) {
        fs.writeFileSync(filePath, JSON.stringify({ ventas: [] }, null, 2));
        return { ventas: [] };
    }

    return JSON.parse(data);
};

// Obtener todas las ventas
ventaCtrl.getVentas = (req, res) => {
    const database = readDatabase(ventasPath);

    // Verificar si la clave "ventas" existe
    if (!database.ventas) {
        return res.status(200).json({ ventas: [] });
    }

    res.json(database.ventas);
};

module.exports = ventaCtrl;