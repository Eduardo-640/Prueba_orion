const { Router } = require('express');
const router = Router();

const inmobiliariaCtrl = require('../controllers/inmobiliaria.controller');

router.get('/', inmobiliariaCtrl.getInmobiliarias);

router.post('/', inmobiliariaCtrl.createInmobiliaria);

router.get('/:name', inmobiliariaCtrl.getInmobiliaria);

router.delete('/:name', inmobiliariaCtrl.deleteInmobiliaria);

module.exports = router;