const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

exports.input = async (req, res, dataputs) => {
    try{
        const { kesimpulan, selectkonsul, selectpeserta, idu } = req.body;

        if(kesimpulan && selectkonsul && selectpeserta && idu){
            params = {
                selectkonsul: selectkonsul, 
                selectpeserta: selectpeserta, 
                idpsikolog: idu, 
                kesimpulan: kesimpulan
            }
            var res1 = res;
            url =  MAIN_URL + '/kesimpulan/registerkesimpulan';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.selectkonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/hasilassessment');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/hasilassessment");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/hasilassessment");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/hasilassessment");
    }
}

exports.edit = async (req, res, dataputs) => {
    try{
        const { modalidkesimpulan, modalkesimpulan, modalidkonsulkesimpulan, modalidpsikologkesimpulan, modalidpesertakesimpulan } = req.body;

        if(modalidkesimpulan && modalkesimpulan && modalidkonsulkesimpulan && modalidpsikologkesimpulan && modalidpesertakesimpulan){
            params = {
                idkesimpulan: modalidkesimpulan, 
                selectkonsul: modalidkonsulkesimpulan, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan, 
                kesimpulan: modalkesimpulan
            }
            var res1 = res;
            url =  MAIN_URL + '/kesimpulan/editkesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.selectkonsul;
                req.session.idpesertainput = res.data.selectpeserta;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/kesimpulanassessmentpeserta');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/kesimpulanassessment");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/kesimpulanassessment");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/kesimpulanassessment");
    }
}

exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidkesimpulanhapus, modalidkonsulkesimpulan, modalidpsikologkesimpulan, modalidpesertakesimpulan } = req.body;

        if(modalidkesimpulanhapus && modalidkonsulkesimpulan && modalidpsikologkesimpulan && modalidpesertakesimpulan){
            params = {
                idkesimpulan: modalidkesimpulanhapus, 
                selectkonsul: modalidkonsulkesimpulan, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan
            }
            var res1 = res;
            url =  MAIN_URL + '/kesimpulan/deletekesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/kesimpulanassessment');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/kesimpulanassessment");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/kesimpulanassessment");
        }
    } catch(err){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Error please contact developer!'
        }
        res.redirect("/kesimpulanassessment");
    }
}