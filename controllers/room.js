const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

/** create room */
exports.Create = async (req, res, dataputs) => {
    const { nama, psikolog } = req.body;

    if(nama && psikolog){
        const Headers = {
            'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
            'Content-Type': 'application/json'
          }
          let data = {
            "name": nama,
            // "properties" : {"eject_after_elapsed":1200}
            "properties" : 
            {
                "max_participants":2, 
                "enable_chat":true,
            }
          }
        /** send data to API daily */
        let res1 = res;
        url = process.env.DAILY_URL;
        axios.post(url, data, {headers: Headers})
        .then(function (res) {
            const urlroom = res.data.url;
            
            /** send data to API icare */
            if( nama && psikolog && urlroom){
                params = {
                    namaroom: nama,
                    urlroom: urlroom, 
                    psikolog: psikolog, 
                }
                let res2 = res;
                url2 = process.env.MAIN_URL + '/room/registerroom';
                axios.post(url2, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/videocall');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/videocall");
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field tidak boleh kosong'
                }
                res1.redirect("/videocall");
            }
        })
        .catch(function (err) {
            // console.log(err);
            // var message = err.response.data.message;
            // var message1 = err.response.data.error;
            var message2 = err.response.data.info;
            req.session.sessionFlash = {
                type: 'error',
                message: message2
            }
            res1.redirect("/videocall");
        })
    } else{
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/videocall");
    }
}

/** hapus room */
exports.Delete = async (req, res, dataputs) => {
    const { modalidhapus, modalnamahapus } = req.body;

    if(modalidhapus && modalnamahapus){
        const Headers = {
            'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
            'Content-Type': 'application/json'
          }
        let res1 = res;
        /** send data to API daily */
        url = process.env.DAILY_URL + '/' + modalnamahapus;
        axios.delete(url, {headers: Headers})
        .then(function (res) {
            //const deleted = res.data.deleted;
            /** send data to API icare */
            //if(deleted === "true"){
                params = {
                    id: modalidhapus,
                }
                let res2 = res;
                url2 = process.env.MAIN_URL + '/room/deleteroom';
                axios.put(url2, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/videocall');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/videocall");
                })
            // } else {
            //     req.session.sessionFlash = {
            //         type: 'error',
            //         message: 'Field tidak boleh kosong'
            //     }
            //     res1.redirect("/videocall");
            // }
        })
        .catch(function (err) {
            // console.log(err);
            // var message = err.response.data.message;
            // var message1 = err.response.data.error;
            var message2 = err.response.data.info;
            req.session.sessionFlash = {
                type: 'error',
                message: message2
            }
            res1.redirect("/videocall");
        })
    } else{
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/videocall");
    }
}