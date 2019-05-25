const localstrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../models/User');
const User = mongoose.model('users');


module.exports = (passport) => {
    passport.use(new localstrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if(!user){
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(password, user.password, (erro, batem) => {
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senha inválida"})
                }
            })

        }).catch((err) => {

        });
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}