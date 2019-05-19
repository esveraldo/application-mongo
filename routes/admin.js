const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categorie');
const Categorie = mongoose.model('categories');
require('../models/Post');
const Post = mongoose.model('posts');


router.get('/', (req, res, next) => {
    res.render('admin/index');
});

router.get('/categories', (req, res, next) => {
    Categorie.find().sort({data: 'desc'})
    .then((categorias) => {
        res.render('admin/categories', { categorias: categorias });
    })
    .catch((err) => {
        req.flash("failed_msg", "Não foi possível carregar a lista de categorias.");
    });
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

router.get('/categories/edit/:id', (req, res) => {
    Categorie.findOne({_id : req.params.id})
    .then((categorie) => {
        res.render('admin/editcategories', {categorie : categorie});
    })
    .catch((err) => {
        req.flash('failed+msg', 'Esta categoria não existe.');
        res.redirect('admin/categories');
    });
});

router.post('/categories/store', (req, res) => {
    Categorie.findOne({_id : req.body.id})
    .then((categorie) => {

        categorie.name = req.body.name;
        categorie.slug = req.body.slug;

        categorie.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso.');
            res.redirect('/admin/categories');
        }).catch((err) => {
            req.flash('failed_msg', 'Houve um erro ao tentar editar a categoria' + err);
            res.redirect('/admin/categories');
        });

    })
    .catch((err) => {
        req.flash('failed_msg', 'Não foi possível alterar a categoria.');
        res.redirect('admin/categories');
    });
});

router.post('/categories/delete', (req, res) => {
    Categorie.remove({_id : req.params.id}).then((categorie) => {
        req.flash('success_msg', 'Categoria removida com sucesso.');
        req.redirect('/admin/categories');
    }).catch((err) => {
        req.flash('failed_msg', 'Não foi possível remover o registro');
        res.redirect('/admin/categories');
    });
});

router.get('/posts', (req, res) => {
    Post.find().populate('categorie').sort({date: 'desc'}).then((post) => {
        res.render('admin/posts', {post: post});
    }).catch((err) => {
        req.flash('failed_msg', 'Erro ao listar postagens');
        res.redirect('admin/posts');
    });
});

router.get('/posts/add', (req, res) => {
    Categorie.find().then((categorie) => {
        res.render('admin/addposts', {categorie: categorie});
    }).catch((err) => {
        req.flash('failed_msg', 'Houve um erro ao listar categorias, tente mais tarde.');
        res.redirect('/posts');
    });
});

router.post('/posts/new', (req, res) => {
    
    const errors = [];

    if(req.body.title == "" || req.body.title == undefined || req.body.title == null){
        errors.push({text: 'Erro ao tentar cadastrar o titulo'});
    }

    if(req.body.slug == "" || req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Erro ao tentar cadastrar o slug'});
    }

    if(req.body.description == "" || req.body.description == undefined || req.body.description == null){
        errors.push({text: 'Erro ao tentar cadastrar a descrição'});
    }

    if(req.body.post == "" || req.body.post == undefined || req.body.post == null){
        errors.push({text: 'Erro ao tentar cadastrar a postagem'});
    }

    if(req.body.categorie === "0"){
        errors.push({text: 'Categoria inválida'});
    }

    if(errors.length > 0){
        res.render('admin/addposts', {errors: errors});
    }else{
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.post,
            categorie: req.body.categorie
        }
        new Post(newPost).save().then(() => {
            req.flash('success_msg', 'Post salvo com sucesso.');
            res.redirect('/admin/posts');
        })
        .catch((err) => {
            req.flash('failed_msg', 'Houve um problema ao tentar cadastrar o post.');
            res.redirect('/admin/posts');
        });
    }
});

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id : req.params.id}).then((post) => {
        Categorie.find().then((categorie) => {

            res.render('admin/editposts', {post : post, categorie : categorie});

        })
        .catch((err) => {
            req.flash('failed_msg', 'Erro ao buscar categorias');
            res.redirect('admin/posts');
        }).catch((err) => {
            req.flash('failed_msg', 'Erro ao buscar postagens.');
            res.redirect('admin/posts');
        });
    })
});

router.post('/posts/store', (req, res) => {

    const errors = [];

    if(req.body.title == "" || req.body.title == undefined || req.body.title == null){
        errors.push({text: 'Erro ao tentar cadastrar o titulo'});
    }

    if(req.body.slug == "" || req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Erro ao tentar cadastrar o slug'});
    }

    if(req.body.description == "" || req.body.description == undefined || req.body.description == null){
        errors.push({text: 'Erro ao tentar cadastrar a descrição'});
    }

    if(req.body.post == "" || req.body.post == undefined || req.body.post == null){
        errors.push({text: 'Erro ao tentar cadastrar a postagem'});
    }

    if(req.body.categorie === "0"){
        errors.push({text: 'Categoria inválida'});
    }

    if(errors.length > 0){
        res.render('admin/editposts', {errors: errors});
    }else{
        Post.findOne({_id : req.body.id}).then((post) => {

            post.title = req.body.title,
            post.slug = req.body.slug,
            post.description = req.body.description,
            post.content = req.body.post,
            post.categorie = req.body.categorie

            post.save().then(() => {
                req.flash('success_msg', 'Postagem editada com sucesso.');
                res.redirect('/admin/posts');
            })
            .catch((err) => {
                req.flash('failed_msg', 'Erro ao editar postagens.');
                res.redirect('/admin/posts');
            });

        }).catch((err) => {
            req.flash('failed_msg', 'Erro ao editar postagens.');
            res.redirect('/admin/posts');
        })
    }
});

router.get('/posts/delete/:id', (req, res) => {
    Post.remove({_id : req.params.id}).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso.');
        res.redirect('/admin/posts');
    })
    .catch((err) => {
        req.flash('failed_msg', 'Erro ao deletar postagem.');
        res.redirect('/admin/posts');
    });
})

module.exports = router;