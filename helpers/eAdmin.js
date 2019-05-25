module.exports = {
    eAdmin : (req, res, next) => {
        if(req.isAuthenticated() && req.user.level == 1){
            return next();
            console.log(req.user);
        }

        req.flash('failed_msg', 'Você não tem permissão para acessar essa página');
        res.redirect('/');
    }
}