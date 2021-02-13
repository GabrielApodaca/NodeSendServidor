const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const usuariosController = require('../controllers/usuariosController');

router.post('/', 
    [
        check('email', 'Agraga un email valido').isEmail(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de almenos 6 caracteres').isLength({min: 6})
    ],
    usuariosController.nuevoUsuario
);

module.exports = router;