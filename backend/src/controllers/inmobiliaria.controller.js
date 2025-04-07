const fs = require('fs');
const path = require('path');

const inmobiliariaCtrl = {};

// Ruta del archivo JSON para almacenar los datos
const databasePath = path.join(__dirname, '../data/inmobiliarias.json');
const ventasPath = path.join(__dirname, '../data/ventas.json'); // Archivo para guardar las ventas

// Función para leer el archivo JSON
const readDatabase = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ inmobiliarias: [] })); // Crea el archivo si no existe
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Función para escribir en el archivo JSON
const writeDatabase = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Obtener todas las inmobiliarias
inmobiliariaCtrl.getInmobiliarias = (req, res) => {
    const database = readDatabase(databasePath);
    res.json(database.inmobiliarias);
};

// Crear una nueva inmobiliaria
inmobiliariaCtrl.createInmobiliaria = (req, res) => {
    const database = readDatabase(databasePath);

    // Verifica si ya existe una inmobiliaria con el mismo nombre
    const existingInmobiliaria = database.inmobiliarias.find(i => i.name === req.body.name);
    if (existingInmobiliaria) {
        return res.status(400).json({ message: 'Ya existe una inmobiliaria con este nombre' });
    }

    const newInmobiliaria = {
        name: req.body.name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    };
    database.inmobiliarias.push(newInmobiliaria);
    writeDatabase(databasePath, database);
    res.status(201).json(newInmobiliaria);
};

// Obtener una inmobiliaria por nombre
inmobiliariaCtrl.getInmobiliaria = (req, res) => {
    const database = readDatabase(databasePath);
    const inmobiliaria = database.inmobiliarias.find(i => i.name === req.params.name);
    if (!inmobiliaria) {
        return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
    }
    res.json(inmobiliaria);
};

// Eliminar una inmobiliaria por nombre
inmobiliariaCtrl.deleteInmobiliaria = (req, res) => {
    const database = readDatabase(databasePath);

    const index = database.inmobiliarias.findIndex(i => i.name === req.params.name);
    if (index === -1) {
        return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
    }

    // Eliminar la inmobiliaria del archivo inmobiliarias.json
    const [deleted] = database.inmobiliarias.splice(index, 1);
    writeDatabase(databasePath, database);

    res.json({ message: 'Inmobiliaria eliminada ' });
};

module.exports = inmobiliariaCtrl;