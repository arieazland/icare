const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

exports.input = async (req, res, dataputs) => {
    const { kesimpulan, selectpeserta, idu } = req.body;

    if(kesimpulan && selectpeserta && idu){
        params = {
            selectpeserta: selectpeserta, 
            idpsikolog: idu, 
            kesimpulan: kesimpulan
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/kesimpulankarir/registerkesimpulan';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            req.session.idkonsulinput = res.data.selectkonsul;
            var message = res.data.message;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            res1.redirect('/hasilassessmentkarir');
        })
        .catch(function (err) {
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/hasilassessmentkarir");
        })
    } else{
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/hasilassessmentkarir");
    }
}

exports.edit = async (req, res, dataputs) => {
    try{
        const { modalidkesimpulan, modalkesimpulan, modalidpsikologkesimpulan, modalidpesertakesimpulan } = req.body;

        if(modalidkesimpulan && modalkesimpulan && modalidpsikologkesimpulan && modalidpesertakesimpulan){
            params = {
                idkesimpulan: modalidkesimpulan, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan, 
                kesimpulan: modalkesimpulan
            }
            var res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulankarir/editkesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                req.session.idpesertainput = res.data.selectpeserta;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/kesimpulanassessmentkarir');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/kesimpulanassessmentkarir");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/kesimpulanassessmentkarir");
        }
    } catch(error){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/kesimpulanassessmentkarir");
    }
}

exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidkesimpulanhapus, modalidpsikologkesimpulan, modalidpesertakesimpulan } = req.body;

        if(modalidkesimpulanhapus  && modalidpsikologkesimpulan && modalidpesertakesimpulan){
            params = {
                idkesimpulan: modalidkesimpulanhapus, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan
            }
            var res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulankarir/deletekesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.redirect('/kesimpulanassessmentkarir');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/kesimpulanassessmentkarir");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/kesimpulanassessmentkarir");
        }
    } catch(error){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/kesimpulanassessmentkarir");
    }
}