var express = require("express");
var bodyParser = require("body-parser");

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
    extended: true
}));

app.get("/", function(req,res){
    return res.send({error : true , message : "Hello world"})
});

app.listen(3000, function(){
    console.log("App is running");
});

module.exports =  app;