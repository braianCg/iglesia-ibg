const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactMessageSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    mensaje: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);