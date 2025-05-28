require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');



const Sermon = require('./models/sermon');
const User = require('./models/user');
const apiRoutes = require('./routes/api');


const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión a MongoDB Atlas exitosa.'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    next();
});

// Middleware de protección de rutas
function isAuthenticated(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', async (req, res) => {
    try {
        const sermons = await Sermon.find().sort({ createdAt: -1 });
        res.render('index', { sermons: sermons });
    } catch (error) {
        console.error("Error al cargar la página de inicio:", error);
        res.status(500).send('Error al cargar la página');
    }
});


app.use('/api', apiRoutes);

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.redirect('/login');
        }


        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.save(err => {
            if (err) {
                console.log(err);
                return res.redirect('/login');
            }
            res.redirect('/admin');
        });
    } catch (error) {
        console.error("Error en el proceso de login:", error);
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.get('/admin', isAuthenticated, async (req, res) => {
    try {
        const sermons = await Sermon.find().sort({ createdAt: -1 });
        res.render('admin', { sermons: sermons });
    } catch (error) {
        console.error("Error al cargar el panel de admin:", error);
        res.status(500).send('Error al cargar el panel de administración');
    }
});

app.get('/admin/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) {
            return res.redirect('/admin');
        }
        res.render('edit-sermon', { sermon: sermon });
    } catch (error) {
        console.error("Error al buscar prédica para editar:", error);
        res.redirect('/admin');
    }
});

app.post('/admin/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { titulo, predicador, descripcion, videoUrl } = req.body;
        await Sermon.findByIdAndUpdate(req.params.id, {
            titulo,
            predicador,
            descripcion,
            videoUrl
        });
        res.redirect('/admin');
    } catch (error) {
        console.error("Error al actualizar la prédica:", error);
        res.redirect('/admin');
    }
});

app.post('/admin/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Sermon.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error("Error al borrar la prédica:", error);
        res.redirect('/admin');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});