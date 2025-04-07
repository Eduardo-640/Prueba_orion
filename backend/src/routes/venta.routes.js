const { Router } = require('express');
const router = Router();

const ventaCtrl = require('../controllers/venta.controller');

router.get('/', ventaCtrl.getVentas);

module.exports = router;