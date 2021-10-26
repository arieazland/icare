const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

exports.input = async (req, res, dataputs) => {
    const { kesimpulan, selectpeserta, idu } = req.body;

    if(kesimpulan && selectpeserta && idu){
        /** send data kesimpulan ke API */
        params = {
            selectpeserta: selectpeserta, 
            idpsikolog: idu, 
            kesimpulan: kesimpulan
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/kesimpulankarir/registerkesimpulan';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            // req.session.idkonsulinput = res.data.selectkonsul;
            const message = res.data.message;
            const namaroom = res.data.nama_room[0].nama_room;
            const idroom = res.data.nama_room[0].id;

            /** hapus room di daily.co */
            const Headers = {
                'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
                'Content-Type': 'application/json'
              }
            let res2 = res;
            /** send data to API daily */
            url = process.env.DAILY_URL + '/' + namaroom;
            axios.delete(url, {headers: Headers})
            .then(function (res) {
                /** hapus room di database */
                const pesan = message
                const id = idroom
                params = {
                    id: id,
                }
                let res2 = res;
                url2 = process.env.MAIN_URL + '/room/deleteroom';
                axios.put(url2, params)
                .then(function (res) {
                    var message2 = pesan;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message2
                    }
                    res1.redirect('/hasilassessmentkarir');
                })
                .catch(function (err) {
                    if(err.response){
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        } 
                        res1.redirect('/hasilassessmentkarir');
                    } else if(err.request){
                        var message = err.request;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/hasilassessmentkarir');
                    } else {
                        var message = err.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/hasilassessmentkarir');
                    }
                })
            })
            .catch(function (err) {
                if(err.response){
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    } 
                    res1.redirect('/hasilassessmentkarir');
                } else if(err.request){
                    var message = err.request;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    }
                    res1.redirect('/hasilassessmentkarir');
                } else {
                    var message = err.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    }
                    res1.redirect('/hasilassessmentkarir');
                }
            })
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
        const { modalidkesimpulan, modalkesimpulan, modalidpsikologkesimpulan, modalidpesertakesimpulan, modalidsesikesimpulan} = req.body;

        if(modalidkesimpulan && modalkesimpulan && modalidpsikologkesimpulan && modalidpesertakesimpulan && modalidsesikesimpulan){
            params = {
                idkesimpulan: modalidkesimpulan, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan,
                selectsesi: modalidsesikesimpulan, 
                kesimpulan: modalkesimpulan
            }
            var res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulankarir/editkesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                req.session.idpesertainput = res.data.selectpeserta;
                req.session.idsesiinput = res.data.selectsesi;
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
        const { modalidkesimpulanhapus, modalidpsikologkesimpulan, modalidpesertakesimpulan, modalidsesikesimpulan } = req.body;

        if(modalidkesimpulanhapus  && modalidpsikologkesimpulan && modalidpesertakesimpulan && modalidsesikesimpulan){
            params = {
                idkesimpulan: modalidkesimpulanhapus, 
                selectpeserta: modalidpesertakesimpulan, 
                idpsikolog: modalidpsikologkesimpulan,
                selectsesi: modalidsesikesimpulan
            }
            var res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulankarir/deletekesimpulan';
            var dataputs = await axios.put(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.idsesiinput = res.data.selectsesi;
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