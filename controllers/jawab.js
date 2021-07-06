const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

exports.input = async (req, res, dataputs) => {
    try{
        const { jawaban, pertanyaan, peserta, selectkonsul } = req.body;

        if(jawaban && pertanyaan && peserta && selectkonsul){
            params = {
                jawaban: jawaban,
                idpertanyaan: pertanyaan,
                iduser: peserta,
                idkonsul: selectkonsul
            }
            var res1 = res;
            url =  process.env.MAIN_URL + '/jawab/registerjawab';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.idkonsulinput = res.data.idkonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                var users = res.data;
                res1.redirect('/assessmentuser');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/assessmentuser");
            })
        } else{
            /** Field tidak boleh kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/assessmentuser");
        }
    } catch(error){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/assessmentuser");
    }
};

exports.edit = async (req, res, dataputs) => {
    
};

exports.delete = async (req, res, dataputs) => {
    
};