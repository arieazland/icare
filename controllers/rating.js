const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

/** Regis Rating */
exports.Registrasi = async (req, res, dataputs) => {
    const { rate, komentar, psikolog, peserta } = req.body;

    if(rate && psikolog, peserta){
        params = {
            rate: rate,
            komentar: komentar,
            psikolog: psikolog,
            peserta: peserta
        }
        /** send data to API daily */
        let res1 = res;
        url = process.env.MAIN_URL + '/rating/registerrating';
        axios.post(url, params)
        .then(function (res) {
            var message = res.data.message;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            res1.redirect('/lihatkesimpulankarirpeserta'); 
        })
        .catch(function (err) {
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/lihatkesimpulankarirpeserta");
        })
    } else{
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Harap pilih rating/bintang terlebih dahulu!'
        }
        res.redirect("/lihatkesimpulankarirpeserta");
    }
}