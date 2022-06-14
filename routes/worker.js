var express = require('express');
var router = express.Router();
const connection = require("../db");
const auth = require('./middleware/auth');
const hbs = require("hbs");

/** Helper for generate status full name */
hbs.registerHelper("mStatus", function (value) {
    if (value == "P") {
        return "Pending";
    } else if (value == "A") {
        return "Approved";
    } else if (value == "R") {
        return "Rejected";
    }
});
/** Helper if condition check from template */
hbs.registerHelper('if_eq', function (a, b) {
    if (a == b) {
        return true;
    } else {
        return false;
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render("worker/login", { title: 'Worker login' })
});

router.post('/login', function (req, res, next) {
    var reqbody = req.body;
    if (reqbody.email && reqbody.password) {
        var query = `SELECT * FROM worker WHERE email =? AND password =?`;
        connection.query(query, [reqbody.email, reqbody.password], function (error, rows) {
            if (error) throw error;
            if (rows.length > 0) {
                req.session.isLoggedIn = true;
                req.session.loggedinType = 'worker';
                req.session.userName = rows[0].name;
                req.session.userId = rows[0].id;
                res.redirect("/worker/dashboard");
            } else {
                res.redirect("/worker");
            }
        })
    }
});

router.get('/dashboard', auth, function (req, res, next) {
    console.log(req.session);
    res.render("worker/dashboard", { title: 'Worker Login', layout: 'worker-layout' })
});


///////////////////////////////////// View profile///////////////////////////////////////////////
///////////////////////////////////// View profile///////////////////////////////////////////////
///////////////////////////////////// View profile///////////////////////////////////////////////
///////////////////////////////////// View profile///////////////////////////////////////////////

router.get('/profile', auth, function (req, res, next) {
    var query = `SELECT * FROM worker WHERE id =?`;
    connection.query(query, [req.session.userId], function (error, rows) {
        if (error) throw error;
        else {
            res.render("worker/worker-profile", { data: rows[0], layout: 'worker-layout' })
        }
    })

});

router.get('/dashboard', auth, function (req, res, next) {
    console.log(req.session);
    res.render("worker/dashboard", { data: rows, layout: 'worker-layout' })
});




/////////////////////////////////////  posted work  ///////////////////////////////////////////////
/////////////////////////////////////  posted work  ///////////////////////////////////////////////
/////////////////////////////////////  posted work  ///////////////////////////////////////////////
/////////////////////////////////////  posted work  ///////////////////////////////////////////////

//View posted work.....

router.get('/work-list', function (req, res, next) {
    var query = `SELECT work.*, users.*, work.id AS postId FROM post_work AS work 
                            JOIN users AS users
                                 ON work.users_id = users.id`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('showingwork-list', { data: rows });
        }
    })

});


////THIS SECTION FOR VIEW THE POSTED WORK ..........

router.get('/selected-work', function (req, res, next) {
    var query = `SELECT * FROM post_work AS work 
                             JOIN users AS users
                                    ON work.users_id = users.id where work.id="` + req.query.id + `"`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('details-postwork', { data: rows });
        }
    })

});


///////////////////////////////////// My Work List  ///////////////////////////////////////////////
///////////////////////////////////// My Work List  ///////////////////////////////////////////////
///////////////////////////////////// My Work List  ///////////////////////////////////////////////
///////////////////////////////////// My Work List ///////////////////////////////////////////////


//MY WORK LIST SHOWING.........
router.get('/my-work-list', function (req, res, next) {
    var query = `SELECT * FROM post_work AS work 
                            JOIN users AS users
                                 ON work.users_id = users.id`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('worker/my-work-list', { data: rows, layout: 'worker-layout' });
        }
    })

});



//MY WORK LIST DETAILS SHOWING.........
router.get('/details-work', function (req, res, next) {
    var query = `SELECT * FROM post_work AS work 
                      JOIN users AS users
                      ON work.users_id = users.id where work.id="` + req.query.id + `"`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('worker/details-work', { data: rows, layout: 'worker-layout' });
        }
    })

});




///////////////////////////////////// My Interested List  ///////////////////////////////////////////////
///////////////////////////////////// My Interested List  ///////////////////////////////////////////////
///////////////////////////////////// My Interested List  ///////////////////////////////////////////////
///////////////////////////////////// My Interested List ///////////////////////////////////////////////

router.get('/my-interested-work', function (req, res, next) {
    var query = `SELECT * FROM post_work AS work 
                            JOIN work_interest AS interest
                                 ON work.id = interest.work_id
                                    JOIN users AS users
                                        ON work.users_id = users.id 
                                        WHERE interest.worker_id=?`;
    connection.query(query, [req.session.userId], function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('worker/my-interested-work', { data: rows, layout: 'worker-layout' });
        }
    })

});

module.exports = router;