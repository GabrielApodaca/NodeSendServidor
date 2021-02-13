const mongosse = require('mongoose');
const Schema = mongosse.Schema;

const usuariosSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongosse.model('Usuarios', usuariosSchema);