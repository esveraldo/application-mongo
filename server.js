//FIXME modulos
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

//TODO configuracoes
//TODO body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//TODO Sessao
app.use(session({
    secret: 'qualquercoisa',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//TODO Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//TODO handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//TODO Base de dados
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp')
.then(() => {
    console.log('Base running.');
})
.catch((err) => {
    console.log('Base ' + err);
});

//TODO Public
app.use(express.static(path.join(__dirname, 'public')));

//TODO Rotas
app.get('/', (req, res, next) => {
    res.send('Página inicial');    
});
app.use('/admin', admin);

//TODO server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})