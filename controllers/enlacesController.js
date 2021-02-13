const Enlaces = require('../models/Enlaces');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    } 

    // crear un objeto del enlace
    const { nombre_original, nombre } = req.body;
    
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    
    // si el usuario esta autenticado
    if(req.usuario) {
        const { password, descargas } = req.body;

        // asignar a enlace el numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // asignar a enlace el password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash( password, salt );
        }

        // asignar el autor
        enlace.autor = req.usuario.id;
    }

    // almacenar en la bd
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}`});
    } catch(error) {
        console.log(error);
    }

};

// obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({enlaces});
    } catch(error) {
        console.log(error);
    }
};

// rotorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
    const { url } = req.params;

    // verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });

    if(!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe...' });
        return next();
    }

    if(enlace.password) {
        return res.json({ password: true, enlace: enlace.url, archivo: enlace.nombre });
    }

    next();
};

// verificar si el password es correcto
exports.verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    // consultar por el enlace
    const enlace = await Enlaces.findOne({ url });

    // verificar el password
    if(bcrypt.compareSync( password, enlace.password ) ) {
        // Permitir al usuario descargar el archivo
        next();
    } else {
        return res.status(401).json({msg: 'Password Incorrecto'});
    }
};

// obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

    const { url } = req.params;

    // verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });

    if(!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe...' });
        return next();
    }
    
    // si el enlace existe
    res.json({ archivo: enlace.nombre, password: false });
    next();
};