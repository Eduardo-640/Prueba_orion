const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde .env

const authCtrl = {};
const secretKey = process.env.SECRET_KEY; // Obtener la clave secreta desde el archivo .env

// Ruta del archivo JSON para almacenar los usuarios
const usersPath = path.join(__dirname, '../data/users.json');

// Función para leer el archivo JSON
const readUsers = () => {
    if (!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, JSON.stringify({ users: [] }));
    }
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
};

// Función para escribir en el archivo JSON
const writeUsers = (data) => {
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

// Registro de usuario
authCtrl.register = async (req, res) => {
    try {
        const { username, password } = req.body; 
        
        // Verificar si el usuario ya existe
        const database = readUsers();
        const userExists = database.users.find(u => u.username === username);
        
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = {
            id: database.users.length + 1,
            username,
            password: hashedPassword
        };

        database.users.push(newUser);
        writeUsers(database);

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

// Login de usuario
authCtrl.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Buscar usuario
        const database = readUsers();
        const user = database.users.find(u => u.username === username);
        
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Generar token
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: 86400 // 24 horas
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error en el login" });
    }
};

module.exports = authCtrl;

