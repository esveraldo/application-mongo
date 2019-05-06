const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categories');
const Categorie = mongoose.model('categories');

router.get('/', (req, res, next) => {
    res.render('admin/index');
});

router.get('/posts', (req, res, next) => {
    res.send('Posts');
});

router.get('/categories', (req, res, next) => {
    res.render('admin/categories');
});

router.get('/categories/add', (req, res, next) => {
    res.render('admin/addcategories');
});

router.post('/categories/new', (req, res, next) => {

    const errors = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "Erro no nome da categoria."});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.name == null){
        errors.push({text: "Erro no slug."});
    }

    if(req.body.slug.length < 2){
        errors.push({text: "O slug é muito pequeno."});
    }

    if(errors.length > 0){
        res.render('admin/addcategories', {errors: errors});
    }else{
        const newCategorie = {
            name: req.body.name,
            slug: req.body.slug
        }
    
        new Categorie(newCategorie).save()
        .then(() => {
            req.flash('success_msg', 'Categoria adicionada com sucesso.');
            res.redirect('/admin/categories');
            //console.log('Categoria salva com sucesso.');
        })
        .catch((err) => {  
            req.flash('failed_msg', 'Não foi possível adicionar categoria.');
            res.redirect('/admin/categories');
            //console.log('Erro ao salvar categoria ' +err);
        })
    }
});

module.exports = router;