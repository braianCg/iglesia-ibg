const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sermonSchema = new Schema({
    titulo: { type: String, required: true },
    predicador: { type: String, required: true },
    descripcion: { type: String, required: true },
    videoUrl: { type: String }, // Opcional, para un link de YouTube
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sermon', sermonSchema);