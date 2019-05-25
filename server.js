//FIXME modulos
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const users = require('./routes/user');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Post');
const Post = mongoose.model('posts');
require('./models/Categorie');
const Categorie = mongoose.model('categories');

const passport = require('passport');
require('./config/auth')(passport)

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

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//TODO Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.failed_msg = req.flash('failed_msg');
    res.locals.error = req.flash("error");
    //TODO PESQUISAR UMA SOLUÇÃO MELHOR
    res.locals.user = req.user || null;
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

    Post.find().sort({data : 'desc'}).then((posts) => {
        res.render('index', {posts : posts});
    }).catch((err) => {
        req.flash('failed_msg', 'Houve um erro interno ao listar os posts');
        res.redirec('/404');
    });    
});

app.get('/posts/:slug', (req, res) => {
    Post.findOne({slug : req.params.slug}).then((post) => {
        if(post){
            res.render('posts/index', {post: post});
        }else{
            req.flash('failed_msg', 'Não existe essa postagem.');
            res.redirect('/');
        }
    }).catch((err) => {
        req.flash('failed_msg', 'Houve um erro interno ' + err);
        res.redirect('/');
    });
});

app.get('/categories', (req, res) => {
    Categorie.find().then((categorie) => {
        res.render('categories/index', {categorie : categorie});
    })
    .catch((err) => {
        req.flash('failed_msg', 'Houve um erro ao listar as categorias' + err);
        res.redirect('/');
    });
});

app.get('/categories/posts/:slug', (req, res) => {

    Categorie.findOne({slug : req.params.slug}).then((categorie) => {
        if(categorie){
            Post.find({categorie : categorie._id}).then((posts) => {
                res.render('categories/posts', {posts : posts, categorieName : categorie.name});
            }).catch((err) => {
                req.flash('failed_msg', 'Não foi possível listar as postagens');
                res.redirect('/');
            });
        }else{
            req.flash('failed_msg', 'Essa categoria não existe.');
            res.redirect('/');
        }
    })
    .catch((err) => {
        req.flash('failed_msg', 'Houve um erro ao carregar a página desta categoria.');
        res.redirect('/');
    });
});

app.get('/404', (req, res) => {
    res.send('Opsss, Erro 404.');
});

app.use('/admin', admin);
app.use('/users', users);

//TODO server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})