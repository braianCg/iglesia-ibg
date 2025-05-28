// routes/api.js
const express = require('express');
const router = express.Router();

const ContactMessage = require('../models/contactMessage');
const Sermon = require('../models/sermon');

// Endpoint para guardar un mensaje de contacto
router.post('/contact', async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;
        const newMessage = new ContactMessage({ nombre, email, mensaje });
        await newMessage.save();
        res.status(201).json({ message: '¡Mensaje recibido! Gracias por contactarnos.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el mensaje.', error: error });
    }
});

// Endpoint para guardar una nueva prédica
router.post('/sermons', async (req, res) => {
    try {
        const { titulo, predicador, descripcion, videoUrl } = req.body;
        const newSermon = new Sermon({ titulo, predicador, descripcion, videoUrl });
        await newSermon.save();
        res.redirect('/admin?success=true'); // Redirige al admin con un mensaje de éxito
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la prédica.', error: error });
    }
});

module.exports = router;