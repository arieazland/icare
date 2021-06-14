const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

exports.input = async (req, res, dataputs) => {
    try{
        const { pertanyaan, selectkonsul } = req.body;

        if(pertanyaan && selectkonsul){
            params = {
                pertanyaan: pertanyaan,
                idkonsul: selectkonsul
            }
            var res1 = res;
            url =  MAIN_URL + '/soal/registersoal';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.idkonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                var users = res.data;
                res1.redirect('/soal');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/soal");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/soal");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/soal");
    }
};

exports.edit = async (req, res, dataputs) => {
    try{
        const { modalpertanyaan, modalidpertanyaan, selectkonsul } = req.body;

        if(modalpertanyaan && modalidpertanyaan && selectkonsul){
            params = {
                id: modalidpertanyaan,
                pertanyaan: modalpertanyaan,
                idkonsul: selectkonsul
            }
            var res1 = res;
            url =  MAIN_URL + '/soal/editsoal';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.idkonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/soal');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/soal");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/soal");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: err
        }
        res.redirect("/soal");
    }
};

exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidpertanyaanhapus, selectkonsul } = req.body;

        if(modalidpertanyaanhapus && selectkonsul){
            params = {
                id: modalidpertanyaanhapus,
                idkonsul: selectkonsul
            }
            var res1 = res;
            url =  MAIN_URL + '/soal/deletesoal';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.idkonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/soal');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/soal");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/soal");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: err
        }
        res.redirect("/konsul");
    }
};