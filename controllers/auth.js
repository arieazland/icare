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
            const { email, password } = req.body;
            
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
                
                if(message === 'User anda sudah di nonaktifkan'){
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'User anda sudah di nonaktifkan!'
                    }
                    res1.redirect("/login");
                } else if(message === 'Email atau password salah'){
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Email atau password salah!'
                    }
                    res1.redirect("/login");
                } else {
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Error please contact developer!'
                    }
                    res1.redirect("/login");
                }
                
            })
        } else {
            /** username dan password kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Email atau password tidak boleh kosong!'
            }
            res1.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res1.redirect("/login");
    }        
};

exports.reg = async (req, res, dataputs) => {
    try{
        const { nama, email, password, password2, tipeakun } = req.body;

        if(nama && email && password && password2 && tipeakun){
            if(password == password2){
                params = {
                    nama: nama,
                    email: email,
                    password: password,
                    password2: password2,
                  }
                var res1 = res;
                if(tipeakun == 'admin'){
                    url =  MAIN_URL + '/auth/registeradmin';
                } else if(tipeakun == 'reguler'){
                    url =  MAIN_URL + '/auth/registerpesertareguler';
                } else if(tipeakun == 'event'){
                    url =  MAIN_URL + '/auth/registerpesertaevent';
                } else if(tipeakun == 'psikolog'){
                    url =  MAIN_URL + '/auth/registerpsikolog';
                }
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: 'Penginputan Berhasil!'
                    }
                    var users = res.data;
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Penginputan Gagal!'
                    }
                    res1.redirect("/users");
                })



            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Password dan konfirmasi password tidak sama'
                }
                res1.redirect("/users");
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res1.redirect("/users");
        }
    } catch(err){

    }
}

/** Reg Psikolog Process */
exports.regPsikolog = async (req, res, dataputs) => {
    try{
        const { nama, email, password, password2 } = req.body;

        if(nama && email && password && password2){
            if(password == password2){
                params = {
                    nama: nama,
                    email: email,
                    password: password,
                    password2: password2 
                  }
                var res1 = res;
                url =  MAIN_URL + '/auth/registerpsikolog';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var users = res.data;
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Pengiknputan Gagaln!'
                    }
                    res1.redirect("/users");
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Password dan konfirmasi password tidak sama'
                }
                res1.redirect("/users");
            }
            
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res1.redirect("/users");
        }
    } catch (error) {

    }
}

