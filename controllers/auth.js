const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');
const axios = require('axios');

// Dotenv.config({ path: './.env' });
// const Connection = require ("../DBconnection");

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
            var dataputs = await axios.post('http://localhost:5023/auth/login', params)
            .then(function (res) {
                // console.log("berhasil")
                // console.log(res.data);
                req.session.loggedIn = true;
                req.session.userdata = res.data.data;
                req.session.email = res.data.data[0].email;
                var users = res.data;
                res1.redirect('/')
                console.log(req.session.email)
            })
            .catch(function (err) {
                console.log(err);
            })
        } else {
            /** username dan password kosong */
            console.log("Kosong")
        }
    } catch (error) {
        console.log(error);
    }        
};

