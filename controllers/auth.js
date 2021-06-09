const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

/** Login Process */
exports.login = async (req, res, dataputs) => {
    try {
        const { email, password } = req.body;

        if(email && password){
            params = {
                email: email,
                password: password
              }
            var res1 = res;
            url =  MAIN_URL + '/auth/login';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                // var message = res.data.message;
                // console.log(message)
                req.session.loggedIn = true;
                req.session.userdata = res.data.data;
                req.session.nama = res.data.data[0].nama;
                req.session.username = res.data.data[0].username;
                var users = res.data;
                res1.redirect('/');
            })
            .catch(function (err) {
                /** get message from API */
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/login");
                
            })
        } else {
            /** username dan password kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Email atau password tidak boleh kosong!'
            }
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/login");
    }        
};

exports.reg = async (req, res, dataputs) => {
    try{
        const { nama, email, password, password2, tipeakun } = req.body;

        if(nama && email && password && password2 && tipeakun != '0'){
            if(password == password2){
                params = {
                    nama: nama,
                    email: email,
                    password: password,
                    password2: password2,
                }
                var res1 = res;
                url =  MAIN_URL + '/auth/register' + tipeakun;
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    var users = res.data;
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Password dan konfirmasi password tidak sama'
                }
                res.redirect("/users");
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }
    } catch(err){
        console.log(err);
    }
}

/** Edit User */
exports.edit = async (req, res, dataputs) => {
    try{
        const { modalid, modalnama, modalemail } = req.body;
        if(modalid && modalemail && modalnama){
            params = {
                id: modalid,
                nama: modalnama,
                email: modalemail
            }
            var res1 = res;
            url =  MAIN_URL + '/auth/edituser';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })

        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }

    } catch(err){
        console.log(err);
    }
}

/** Delete User */
exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidhapus } = req.body;
        if(modalidhapus){
            params = {
                id: modalidhapus
            }
            var res1 = res;
            url =  MAIN_URL + '/auth/deleteuser';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }
    } catch(err){
        console.log(err);
    }
}

