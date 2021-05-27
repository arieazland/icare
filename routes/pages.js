const Express = require("express");
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
    res.render("index");
});

/** Route for Login */
Router.get('/login', (req, res) => {
    res.render("login");
});

/** Route for List User */
Router.get('/users', (req, res) => {
    res.render("users");
});

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