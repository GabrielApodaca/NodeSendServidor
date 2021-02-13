// subida de archivos
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlaces');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? (1024 * 1024) * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`)
            }/*,
            fileFilter: (req, file, cb) => {
                if(file.mimetype === "application/pdf") {
                    return cb(null, true);
                }
            }*/
        })
    };

    const upload = multer(configuracionMulter).single('archivo');

    upload(req,res, async (error) => {

        if(!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });

};

exports.eliminarArchivo = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch(error) {
        console.log(error);
    }
};

// descarga un archivo
exports.descargar = async (req, res, next) => {

    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDescarga = `${__dirname}/../uploads/${archivo}`;
    res.download(archivoDescarga);

    // Eliminar el archivo en la entrada de la bd
    const { descargas, nombre } = enlace;
    
    if( descargas === 1 ) {
        // si las descargas son iguales a 1 - borrar el enlace y tambien el archivo

        //      eliminar el archivo
        req.archivo = nombre;

        //      eliminar la entrada a la bd
        await Enlaces.findOneAndRemove(enlace.id);

        next();
    } else {
        // si las descargas son mayores 1 - restar 1 a las descargas
        enlace.descargas--;
        await enlace.save();
    }
}; 