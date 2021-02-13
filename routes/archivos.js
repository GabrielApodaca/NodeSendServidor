const express = require('express');
const router = express.Router();

const archivosController = require('../controllers/archivosController');
const auth = require('../midleware/auth');

router.post('/', auth, archivosController.subirArchivo);

router.get('/:archivo', 
    archivosController.descargar,
    archivosController.eliminarArchivo);

module.exports = router;