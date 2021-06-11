const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

exports.input = async (req, res, dataputs) => {
    try{
        const { selectpartisipant } = req.body;

        if(selectpartisipant){

        } else {
          /** Field tidak boleh kosong */
          req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
          }
          res.redirect("/partisipant");
        }
        
    } catch (err){
        console.log(err);
        /** catch */
        // req.session.sessionFlash = {
        //     type: 'error',
        //     message: 'Error please contact developer!'
        // }
        // res.redirect("/konsul");
    }
}