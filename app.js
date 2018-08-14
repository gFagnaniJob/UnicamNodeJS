console.log("Start the server");

const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var session = require('express-session');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var sqllite = require("./module/sqlite.js");

const admin_user = {
    user:"admin@admin.it",
    password: "admin"
  }

app.set('view engine', 'ejs');
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    name: 'session',
    keys: ['username']
  }))
/**
 * Ejs uses by default the views in the 'views' folder. 

app.get('/', function(req, res){ 
    var objPassedToView= {user: "James Bond" +Math.random() ,title:"Test di Esempio Unicam"};
    res.render('index',objPassedToView);
    });
 */

var checkAuthentication =   function(req, res, next) {
    console.log(req.session)
    if (req.session && req.session.admin_user)
    {
      next();
    }
    else
    {
      // user doesn't have access, return an HTTP 401 response
      res.redirect("/");
    }
  };


app.get('/', function(req, res){ 
        res.render('login');
        });


app.post('/login', function (req, res) {
  console.log(req.body)
  user = req.body.email;
  password = req.body.password;
  session = req.session;
  console.log(user, password);
  session = req.session;
  console.log("session",session)

  if (user == admin_user.user && password == admin_user.password) {
    session.admin_user = admin_user;
    console.log("is authenticated")
    res.redirect('/students');
  } else {
    res.redirect('/');
  }

});
app.get('/students',checkAuthentication,function (req, res) {
   
    sqllite.getStudents( function (students) {
        res.render('students', {
          "students": students
        });
    
      });

    
});

//Initialize the server
app.listen(4000,function(){
    console.log("Live at Port 4000");
    });
    