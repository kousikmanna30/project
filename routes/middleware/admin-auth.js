module.exports = (req, res, next) =>{
    try{
        if (req.session.isLoggedIn) {
            res.locals.session = req.session;
            next();
        }else{
            res.redirect('/admin')
        }
    }
    catch(error){
        res.redirect('/admin')
    }
}