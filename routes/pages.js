const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
// const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

// Dotenv.config({ path: './.env' });
// const Connection = require ("../DBconnection");

/** Route for Home */
Router.get('/', (req, res) => {
    emailgw = req.session.email
    res.render("index",{
        emailgw
    });
});

/** Route for Login */
Router.get('/login', (req, res) => {
    res.render("login");
});

/** Route for get user list */
Router.get('/users', async (req, res, next) => { 
    let res1 = res;
    axios.get('http://localhost:5023/auth/userlist')
    .then(function (res) {
        var users = res.data;
        res1.render('users', {
            data: users.data
        })
    })
    .catch(function (err) {
        console.log(err);
    })
})

/** Route for CRUD Event */
Router.get('/event', (req, res) => {
    res.render("event");
});

/** Route for CRUD List Soal */
Router.get('/listsoal', (req, res) => {
    res.render("soal");
});

/** Route for CRUD Assessment */
Router.get('/assessment', (req, res) => {
    res.render("assessment");
});

/** Route for CRUD Kesimpulan */
Router.get('/kesimpulan', (req, res) => {
    res.render("kesimpulan");
});

module.exports = Router;