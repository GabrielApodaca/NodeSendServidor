const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

require('dotenv').config({ path: 'variables.env'});

exports.autenticarUsuario = async (req, res, next) => {

    // revisar si hay errores
    // mostrar los mensajes de error de express-validator
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    } 

    // buscar el usuario para ver si esta registrado
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });  
    
    if(!usuario) {
        res.status(401).json({ msg: 'El usuario no existe...'});
        return next();
    }

    // verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)) {
        // crear jwt - (json web token)
        const token = jwt.sign({
            id: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre
        }, process.env.SECRETA, {
            expiresIn: '8h'
        });

        res.json({token});

    } else {
        res.status(401).json({ msg: 'Password Incorrecto...'});
        return next();
    }

};

exports.usuarioAutenticado = (req, res, next) => {
    res.json({ usuario: req.usuario });
};    
