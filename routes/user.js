const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');

const bcrypt = require('bcrypt');

const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register/add', (req, res) => {
    const errors = [];
    
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: 'O usuário não pode ser nulo.'});
    }
    
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: 'O email não pode ser nulo.'});
    }
    
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: 'A senha não pode ser nulo.'});
    }

    if(req.body.password != req.body.passwordRepeat){
        errors.push({text: 'As senhas não conferem'});
    }

    if(errors.length > 0){
        res.render('users/register', {errors : errors});
    }else{

        User.findOne({email: req.body.email}).then((user) => {

            if(user){
                req.flash('failed_msg', 'Já existe um usuário cadastrado com esse email');
                res.redirect('/users/register');
            }else{
                const newUser = new User({
                    name : req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            req.flash('failed_msg', 'Houve um erro durante a codificação da senha do usuário');
                            res.redirect('/users/register');
                        }
                        
                        newUser.password = hash;

                        newUser.save().then(() => {
                            req.flash('success_msg', 'Usuário criado com sucesso.');
                            res.redirect('/users/register');
                        }).catch((err) => {
                            req.flash('failed_msg', 'Não foi possível criar o usuário.');
                            res.redirect('/users/register');
                        });

                    });
                })
            }

        }).catch((err) => {
            req.flash('failed_msg', 'Houve um erro ao validar o email para cadastro' + err);
            res.redirect('/users/register');
        });
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)

})


module.exports = router;