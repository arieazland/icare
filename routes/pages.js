const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
const MAIN_URL = require ("../urlconfig.js");
const Moment = require("moment");

require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Route for Home */
Router.get('/', (req, res) => {
    if(req.session.loggedIn){
        username = req.session.username
        nama = req.session.nama
        res.render("index",{
            username, nama
        });
    } else {
        // req.session.sessionFlash = {
        //     type: 'error',
        //     message: 'Silahkan login terlebih dahulu!'
        // }
        res.redirect('/login');
    }
});

/** Route for Login */
Router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
    } else {
        res.render("login");
    }
});

/** Route for get user list */
Router.get('/users', async (req, res) => { 
    if(req.session.loggedIn){
        let res1 = res;
        url =  MAIN_URL + '/userlist';
        axios.get(url)
        .then(function (res) {
            var users = res.data;
            res1.render('users', {
                data: users.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/users");
        })
    } else {
        res.redirect('/login');
    }
})

/** Route for get Konsul/Event list*/
Router.get('/konsul', async (req, res) => { 
    if(req.session.loggedIn){
        let res1 = res;
        url =  MAIN_URL + '/konsullist';
        axios.get(url)
        .then(function (res) {
            var konsul = res.data;
            res1.render('konsul', {
                data: konsul.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/konsul");
        })
    } else {
        res.redirect('/login');
    }
})

Router.get('/partisipant', (req, res) => {
    res.render("partisipant");
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

/** Router for logout */
Router.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

module.exports = Router;