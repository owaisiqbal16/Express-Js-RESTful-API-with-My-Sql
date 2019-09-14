var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');

var app = express();

var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api'
})

dbConn.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


//INDEX ROUTE
app.get("/", function (req, res) {
    return res.send({ error: true, message: "Hello world" })
});

app.get("/user/new", function (req, res) {
    res.render("form.ejs");
});

//FETCH ALL USERS
app.get("/users", function (req, res) {
    dbConn.query('SELECT * FROM users', function (err, results, fields) {
        if (err) {
            throw err;
        }
        else {
            return res.send({ error: false, data: results, message: 'users list.' });
        }
    })
})

//FETCH SINGLE USER
app.get("/user/:id", function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('SELECT * FROM users where id=?', user_id, function (err, results, fields) {
        if (err) throw err;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

//ADD NEW USER
app.post("/user", function (req, res) {
    var user = {
        name: req.body.name,
        email: req.body.email
    };
    const {name,email}=req.body
    console.log(user)
    if (!user) {
        return res.status(400).send({ error: true, message: 'please provide user' });
    }
    dbConn.query(`INSERT INTO users (name,email) values('${name}','${email}')`, function (error, results, fields) {
        if (error) { throw err }
        else {
            return res.send({ error: false, data: results, message: "Added new user successfully" });
        }
    })
})

//Update User
app.put('/user', function (req, res) {
    var user = {
        name: req.body.name,
        email: req.body.email,
        id : req.body.id
    };
    if (!user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE users SET name = ? WHERE id = ?" , [user.name,user.id] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});

//Delete User
app.delete('/user', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
});

app.listen(3000, function () {
    console.log("App is running");
});

module.exports = app;