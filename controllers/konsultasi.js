const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

exports.input = async (req, res, dataputs) => {
    try{
        const { namakonsultasi, tanggalmulai, tanggalakhir } = req.body;

        if(namakonsultasi && tanggalmulai && tanggalakhir){
            params = {
                nama: namakonsultasi,
                tanggal1: tanggalmulai,
                tanggal2: tanggalakhir
            }
            var res1 = res;
            url =  MAIN_URL + '/konsul/registerkonsul';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                var users = res.data;
                res1.redirect('/konsul');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/konsul");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/konsul");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/konsul");
    }
};

exports.edit = async (req, res, dataputs) => {
    try{
        const { modalidkonsul, modalnamakonsul, modaltanggalmulaikonsul, modaltanggalberakhirkonsul } = req.body;

        if(modalidkonsul && modalnamakonsul && modaltanggalmulaikonsul && modaltanggalberakhirkonsul){
            params = {
                id: modalidkonsul,
                nama: modalnamakonsul,
                tanggal1: modaltanggalmulaikonsul,
                tanggal2: modaltanggalberakhirkonsul
            }
            var res1 = res;
            url =  MAIN_URL + '/konsul/editkonsul';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/konsul');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/konsul");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/konsul");
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

exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidkonsulhapus } = req.body;

        if(modalidkonsulhapus){
            params = {
                id: modalidkonsulhapus,
            }
            var res1 = res;
            url =  MAIN_URL + '/konsul/deletekonsul';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/konsul');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/konsul");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/konsul");
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