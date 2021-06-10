const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');
const MAIN_URL = require ("../urlconfig.js");

exports.input = async (req, res, dataputs) => {
    try{
        // const { selectpartisipant } = req.body;
        // var selectpartisipant2 = req.body.selectpartisipant
        // var i = 0
        // for(i;i<selectpartisipant2.length;i++){
        //     console.log(selectpartisipant2)
        // }

        for(var key in req.body) {
            req.body = JSON.parse(JSON.stringify(req.body));
            if(req.body.hasOwnProperty(key)){
              //do something with e.g. req.body[key]
              console.log(req.body[key])
            }
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