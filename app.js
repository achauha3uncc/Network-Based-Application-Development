const mongoose = require('mongoose');
var express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const userRoutes = require('./routes/userRoutes');
const connectionsRoutes = require('./routes/connectionsRoutes');
const path = require('path');
const flash = require('connect-flash');

//express app

var app = express();

//register view engine

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//mongodb connection

mongoose.connect('mongodb://localhost:27017/assignment', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    .then((result) => app.listen(8085))
    .catch((err) => console.log(error));

app.use(session({
    secret: 'NBDA',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null ;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

//listen for requests

// app.listen(8085);
// console.log('listening  on port 8085');

//middleware and static files

app.use(express.static(__dirname + "/public"));

app.get('.css', function (req, res) { res.send('.css'); res.end(); });

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/index', (req, res) => {
    res.render("index");
});

app.use('/users', userRoutes);
app.use('/connections', connectionsRoutes);

app.set('views', path.join(__dirname, 'views'));

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

//404 page
app.use((req, res) => {

    var errorString = "Page cannot be found on server.";
    res.status(404).render('error', { errorString });
})    

app.use((req, res) => {
    res.status(404).render('error', { msg: 'Page cannot be found', name: "Music Meetup Group!" });
});

app.use((error, req, res) => {
    res.status(500).render('error', { msg: 'Sorry, our application is experiencing a problem', name: "Music Meetup Group!" });
});