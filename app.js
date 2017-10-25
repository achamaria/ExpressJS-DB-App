var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));


//Global Vars
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});


app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

var users = [
    {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com'
    },
    {
        id: 2,
        first_name: 'Steven',
        last_name: 'Smith',
        email: 'stevensmith@gmail.com'
    },
    {
        id: 3,
        first_name: 'Jack',
        last_name: 'Johnson',
        email: 'jackjohnson@gmail.com'
    }
]

app.get('/', function (req, res) {
    res.render('index',{
        title: 'Customers',
        users: users
    });
});

app.post('/users/add', function (req, res) {
    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index',{
            title: 'Customers',
            users: users,
            errors: errors
        });
        console.log('ERRORS');
    } else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
    }
});

app.listen(3000, function () {
    console.log('Sever Started');
});