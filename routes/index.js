var express = require('express');
var router = express.Router();
var connection = require('../db');
const hbs = require("hbs");

hbs.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Working_buddy' });
});

router.get('/sign-up', function (req, res, next) {
  res.render('sign-up', { title: 'Signup' });
});

router.post('/register', function (req, res, next) {
  var reqbody = req.body;
  if (reqbody.name && reqbody.email && reqbody.password) {
    var insertdata = {
      name: reqbody.name,
      email: reqbody.email,
      password: reqbody.password
    }
    if (reqbody.type == 'user') {
      var query = `INSERT INTO users SET ?`;
    } else {
      var query = `INSERT INTO worker SET ?`;
    }

    connection.query(query, insertdata, function (error, rows) {
      if (error) throw error;
      else {

        if (reqbody.type == 'user') {
          res.redirect("/users");
        } else {
          res.redirect("/worker");
        }
      }
    })
  }
});





//showing work list for all.....

router.get('/showingwork-list', function (req, res, next) {
  var query = `SELECT * FROM post_work AS work 
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

router.get('/details-postwork', function (req, res, next) {
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

module.exports = router;