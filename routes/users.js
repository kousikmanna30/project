var express = require('express');
var router = express.Router();
const connection = require("../db");
const auth = require('./middleware/auth');
const hbs = require("hbs");

/** Helper for generate status full name */
hbs.registerHelper("mStatus", function(value) {
    if (value == "P") {
        return "Pending";
    } else if (value == "A") {
        return "Approved";
    } else if (value == "R") {
        return "Rejected";
    }
});
/** Helper if condition check from template */
hbs.registerHelper('if_eq', function(a, b) {
    if (a == b) {
        return true;
    } else {
        return false;
    }
});


/////////////////////////////CREATER ROUTS FOR USERS LOGIN //////////////////////////////////
/////////////////////////////CREATER ROUTS FOR USERS LOGIN //////////////////////////////////
/////////////////////////////CREATER ROUTS FOR USERS LOGIN //////////////////////////////////
/////////////////////////////CREATER ROUTS FOR USERS LOGIN //////////////////////////////////

router.get('/', function (req, res, next) {
    res.render("users/login", { title: 'Client login', })
});

router.post('/login', function (req, res, next) {
    var reqbody = req.body;
    if (reqbody.email && reqbody.password) {
        var query = `SELECT * FROM users WHERE email =? AND password =?`;
        connection.query(query, [reqbody.email, reqbody.password], function (error, rows) {
            if (error) throw error;
            if (rows.length > 0) {
                req.session.isLoggedIn = true;
                req.session.loggedinType = 'user';
                req.session.userName = rows[0].name;
                req.session.userId = rows[0].id;
                res.redirect("/users/dashboard");
            } else {
                res.redirect("/users");
            }
        })
    }
});

router.get('/dashboard', auth, function (req, res, next) {
    console.log(req.session);
    res.render("users/dashboard", { title: 'Client Login', layout: 'users-layout' })
});


///////////////////////////////FOR VIEW USERS PROFILE//////////////////////////////////
///////////////////////////////FOR VIEW USERS PROFILE//////////////////////////////////
///////////////////////////////FOR VIEW USERS PROFILE//////////////////////////////////
///////////////////////////////FOR VIEW USERS PROFILE//////////////////////////////////

router.get('/profile', auth, function (req, res, next) {
    var query = `SELECT * FROM users WHERE id =?`;
    connection.query(query, [req.session.userId], function (error, rows) {
        if (error) throw error;
        else {
            res.render("users/users-profile", { data: rows[0], layout: 'users-layout' })
        }
    })

});

///////////////////////////////FOR POST A WORK USERS//////////////////////////////////
///////////////////////////////FOR POST A WORK USERS//////////////////////////////////
///////////////////////////////FOR POST A WORK USERS//////////////////////////////////
///////////////////////////////FOR POST A WORK USERS//////////////////////////////////

router.get('/post-work', auth, function (req, res, next) {
    res.render("users/post-work")
});


router.post('/post-work', auth, function (req, res, next) {
    var reqbody = req.body;
    var insertData = {
        work_name: reqbody.work_name,
        work_type: reqbody.work_type,
        work_description: reqbody.work_description,
        work_location: reqbody.work_location,
        work_amount: reqbody.work_amount,
        work_completed_date: reqbody.work_completed_date,
        users_id: req.session.userId
    }
    var query = `INSERT INTO post_work SET ?`
    connection.query(query, insertData, function (error, rows) {
        if (error) throw error
        else {
            res.redirect('/')
        }
    })

});




///////////////////////////////FOR SHOWING USER SPECIFIC POST WORK //////////////////////////////////
///////////////////////////////FOR SHOWING USER SPECIFIC POST WORK//////////////////////////////////
///////////////////////////////FOR SHOWING USER SPECIFIC POST WORK//////////////////////////////////
///////////////////////////////FOR SHOWING USER SPECIFIC POST WORK//////////////////////////////////

router.get('/my-post', auth, function (req, res, next) {
    var query = `SELECT * FROM post_work WHERE users_id=?`;
    connection.query(query, [req.session.userId], function (error, rows) {
        if (error) throw error;
        else {
            res.render("users/my-post", { data: rows, layout: 'users-layout' })
        }
    })

});



router.get('/selected-my-post', function (req, res, next) {
    var query = `SELECT * FROM post_work where id="` + req.query.id + `"`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('users/selected-my-post', { data: rows, layout: 'users-layout' });
        }
    })

});



//FOR VIEW MYWORK INTERESTED PERSON....

router.get('/mywork-interested-person', function (req, res, next) {
    var query = `SELECT * FROM work_interest AS interest 
                            JOIN worker AS worker
                                ON interest.worker_id = worker.id WHERE interest.work_id="` + req.query.id + `"`;
    connection.query(query, function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.render('users/mywork-interested-person', { data: rows, layout: 'users-layout' });
        }
    })

});



router.get('/update-interested-work', function (req, res, next) {
    console.log(req.query)
    var query = `UPDATE work_interest SET int_status = ? WHERE id = ?`;
    connection.query(query, [req.query.type,req.query.id], function (error, rows) {
        if (error) throw error
        else {
            console.log(rows);
            res.redirect('/users/mywork-interested-person?id='+req.query.work_id);
        }
    })
});






module.exports = router;
