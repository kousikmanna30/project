var express = require('express');
var router = express.Router();
const connection = require("../db");
const hbs = require("hbs");

hbs.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render("admin/login", { title: 'Admin Login', layout: 'admin-layout' })
});

////////////////////////////////////////// FOR ADMIN lOGIN ///////////////////////////////
////////////////////////////////////////// FOR ADMIN lOGIN ///////////////////////////////
////////////////////////////////////////// FOR ADMIN lOGIN ///////////////////////////////
////////////////////////////////////////// FOR ADMIN lOGIN ///////////////////////////////


//for Admin login......
router.post('/login', function (req, res, next) {
  var reqbody = req.body;
  if (reqbody.username && reqbody.password) {
    var query = `SELECT * FROM admin WHERE username =? AND password =?`;
    connection.query(query, [reqbody.username, reqbody.password], function (error, rows) {
      if (error) throw error;
      if (rows.length > 0) {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/admin");
      }
    })
  }
});

router.get('/dashboard', function (req, res, next) {
  console.log(req.session);
  res.render("admin/dashboard", { title: 'Admin Login', layout: 'admin-layout' })
});




////////////////////////////////////////// FOR VIEW WORKER AND USERS LIST ///////////////////////////////
////////////////////////////////////////// FOR VIEW WORKER AND USERS LIST ///////////////////////////////
////////////////////////////////////////// FOR VIEW WORKER AND USERS LIST ///////////////////////////////
////////////////////////////////////////// FOR VIEW WORKER AND USERS LIST ///////////////////////////////

//for view all users list....

router.get('/user-list', function (req, res, next) {
  var query = `SELECT * FROM users`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/user-list', { data: rows, layout: 'admin-layout' });
    }
  })

});


//for view all worker list....
router.get('/worker-list', function (req, res, next) {
  var query = `SELECT * FROM worker`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/worker-list', { data: rows, layout: 'admin-layout' });
    }
  })

});



////////////////////////////////////////// FOR USERS OPARATION ///////////////////////////////
////////////////////////////////////////// FOR USERS OPARATION ///////////////////////////////
////////////////////////////////////////// FOR USERS OPARATION ///////////////////////////////
////////////////////////////////////////// FOR USERS OPARATION ///////////////////////////////

////THIS SECTION FOR VIEW USERS ..........

router.get('/selected-user', function (req, res, next) {
  var query = `SELECT * FROM users where id="` + req.query.id + `"`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/selected-user', { data: rows, layout: 'admin-layout' });
    }
  })

});



//THIS SECTION FOR VIEW SELECTED USERS ALL POSTED WORK ..........

router.get('/selected-user-posted-work', function (req, res, next) {
  var query = `SELECT * FROM post_work`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/selected-user-posted-work', { data: rows, layout: 'admin-layout' });
    }
  })

});


////////////////////////////////////////////FOR WORKER OPERATION///////////////////////////////////////////
////////////////////////////////////////////FOR WORKER OPERATION///////////////////////////////////////////
////////////////////////////////////////////FOR WORKER OPERATION///////////////////////////////////////////
////////////////////////////////////////////FOR WORKER OPERATION///////////////////////////////////////////


////THIS SECTION FOR VIEW WORKER ..........

router.get('/selected-worker', function (req, res, next) {
  var query = `SELECT * FROM worker where id="` + req.query.id + `"`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/selected-worker', { data: rows, layout: 'admin-layout' });
    }
  })

});



/////////////////////////////////////////////////POSTED WORK OPERATION//////////////////////////////////////
/////////////////////////////////////////////////POSTED WORK OPERATION//////////////////////////////////////
/////////////////////////////////////////////////POSTED WORK OPERATION//////////////////////////////////////
/////////////////////////////////////////////////POSTED WORK OPERATION//////////////////////////////////////





//posted work list....
router.get('/work-list', function (req, res, next) {
  var query = `SELECT * FROM post_work AS work 
                        JOIN users AS users
                        ON work.users_id = users.id`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/work-list', { data: rows, layout: 'admin-layout' });
    }
  })

});

////THIS SECTION FOR VIEW THE POSTED WORK ..........

router.get('/selected-postwork', function (req, res, next) {
  var query = `SELECT * FROM post_work AS work 
                      JOIN users AS users
                      ON work.users_id = users.id where work.id="` + req.query.id + `"`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/selected-postwork', { data: rows, layout: 'admin-layout' });
    }
  })

});



//FOR VIEW WORK INTERESTED PERSON....

router.get('/work-interested-person', function (req, res, next) {
  var query = `SELECT * FROM work_interest AS interest 
                       JOIN worker AS worker
                       ON interest.worker_id = worker.id WHERE interest.work_id="` + req.query.id + `"`;
  connection.query(query, function (error, rows) {
    if (error) throw error
    else {
      console.log(rows);
      res.render('admin/work-interested-person', { data: rows, layout: 'admin-layout' });
    }
  })

});






module.exports = router;