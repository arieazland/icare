const Express = require("express");
const Path = require("path");
const Hbs = require("hbs");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');
const app = Express();
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });

/** expired 24jam */
//const duapuluhempatjam = 1000 * 60 * 60 * 24;
//const satujam = 1000 * 60 * 60;
//const satumenit = 1000 * 60;
//const limamenit = 1000 * 30 * 5;
//const tigapuluhdetik = 1000 * 30;
//const duajam = 1000 * 60 * 60 * 2;
const tigajam = 1000 * 60 * 60 * 3;
var session = require("express-session");
app.use(session({
    secret: 'secret',
    cookie: { maxAge: tigajam },
    resave: true,
    saveUninitialized: true
}));

var flash = require('req-flash');
app.use(flash());
app.use(function(req, res, next){
// if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
        res.locals.sessionFlash2 = req.session.sessionFlash2;
        delete req.session.sessionFlash2;
        next();
    });


// Set Engine
const publicDirectory = Path.join(__dirname, './public' );

// Parse URL-encoded bodies (as sent by HTML Forms)
app.use(Express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API Clients)
app.use(Express.json());

app.use(Express.static(publicDirectory));

// Set HBS partial engine
Hbs.registerPartials(__dirname + '/views/partials', function (err) {});
app.set('view engine', 'hbs');
// Count number in each hbs
Hbs.registerHelper("counter", function (index){
    return index + 1;
});
// Set hbs helper loud
Hbs.registerHelper('loud', function(aString){
    return aString.toUpperCase();
});
// Set hbs helper formatdate
Hbs.registerHelper('formatDate', function(dateString) {
    return new Hbs.SafeString(
        Moment(dateString).format("DD MMMM YYYY")
    );
});
Hbs.registerHelper('formatDateDefault', function(dateString) {
    return new Hbs.SafeString(
        Moment(dateString).format("YYYY-MM-DD")
    );
});
// Set hbs helper formattime
Hbs.registerHelper('formatTime', function(time) {
    return new Hbs.SafeString(
        Moment(time, "HH:mm:ss").format("HH:mm")
    );
});
// Set hbs helper selected
Hbs.registerHelper('compare', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

/** define router */
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/konsultasi', require('./routes/konsultasi'));
app.use('/partisipant', require('./routes/partisipant'));
app.use('/soal', require('./routes/soal'));
app.use('/jawab', require('./routes/jawab'));
app.use('/kesimpulankarir', require('./routes/kesimpulankarir'));
app.use('/kesimpulankepribadian', require('./routes/kesimpulankepribadian'));
app.use('/assessment', require('./routes/assessment'));
app.use('/room', require('./routes/room'));
app.use('/rating', require('./routes/rating'));

/** router for index */
// app.get('/', (req, res) => {
//     res.render('index');
// });

let port = process.env.PORT || 5034;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
