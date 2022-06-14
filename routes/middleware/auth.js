module.exports = (req, res, next) =>{
    try{
        if (req.session.isLoggedIn) {
            res.locals.session = req.session;
            next();
        }else{
            res.redirect('/users')
        }
    }
    catch(error){
        res.redirect('/users')
    }
}