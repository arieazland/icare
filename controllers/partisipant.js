const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

exports.input = async (req, res, dataputs) => {
    try{
        const { selectpartisipant , selectkonsul } = req.body;

        if(selectpartisipant && selectkonsul){

          params = {
            iduser: selectpartisipant,
            idkonsul: selectkonsul
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/partisipant/registerpartisipant';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            var message = res.data.message;
            req.session.idkonsulinput = res.data.idkonsul;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            res1.redirect('/partisipant');
        })
        .catch(function (err) {
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/partisipant");
        })

        } else {
          /** Field tidak boleh kosong */
          req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
          }
          res.redirect("/partisipant");
        }
        
    } catch (error){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/partisipant");
    }
}

exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidpartisipanthapus , selectkonsul } = req.body;

        if(modalidpartisipanthapus && selectkonsul){
          params = {
            idconsultacc: modalidpartisipanthapus,
            idkonsul: selectkonsul
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/partisipant/deletepartisipant';
        var dataputs = await axios.put(url, params)
        .then(function (res) {
            var message = res.data.message;
            req.session.idkonsulinput = res.data.idkonsul;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            res1.redirect('/partisipant');
        })
        .catch(function (err) {
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/partisipant");
        })

        } else {
          /** Field tidak boleh kosong */
          req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
          }
          res.redirect("/partisipant");
        }
        
    } catch (error){
        // console.log(err);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/partisipant");
    }
}