const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
const MAIN_URL = require ("../urlconfig.js");
const Moment = require("moment");

require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** temp */
Router.get('/assessmentpsikolog', (req, res) => {
    res.render("assessmentpsikolog");
});

Router.get('/kesimpulanpsikolog', (req, res) => {
    res.render("kesimpulanpsikolog");
});

Router.get('/hasilaseessment', (req, res) => {
    res.render("hasilassessment");
});
/** end of temp */

/** Route for Home */
Router.get('/', (req, res) => {
    if(req.session.loggedIn){
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** login page di arhkan ke page user */
            res.render("indexuser",{
                username, nama
            });
        } else if(tipe === 'psikologis'){
            /** login page di arhkan ke page psikolog */
            res.render("listsoalpsikolog",{
                username, nama
            });
        } else if(tipe === 'admin'){
            /** login page di arhkan ke page admin */
            res.render("index",{
                username, nama
            });
        }
        
    } else {
        // req.session.sessionFlash = {
        //     type: 'error',
        //     message: 'Silahkan login terlebih dahulu!'
        // }
        res.redirect('/login');
    }
});

/** Route for Login */
Router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
    } else {
        res.render("login");
    }
});

/** Route for get user list */
Router.get('/users', async (req, res) => { 
    if(req.session.loggedIn){
        let res1 = res;
        url =  MAIN_URL + '/userlist';
        axios.get(url)
        .then(function (res) {
            var users = res.data;
            res1.render('users', {
                data: users.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/users");
        })
    } else {
        res.redirect('/login');
    }
})

/** Route for get Konsul/Event list*/
Router.get('/konsul', async (req, res) => { 
    if(req.session.loggedIn){
        let res1 = res;
        url =  MAIN_URL + '/konsullist';
        axios.get(url)
        .then(function (res) {
            var konsul = res.data;
            res1.render('konsul', {
                data: konsul.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/konsul");
        })
    } else {
        res.redirect('/login');
    }
})

/** Route for get partisipant list*/
Router.get('/partisipant', async (req, res) => {
    if(req.session.loggedIn){
        if(req.session.idkonsulinput != null){
            /** get data konsul berdasarkan id yang di pilih */
            params = {
                selectkonsul: req.session.idkonsulinput,
            }
            let res1 = res;
            url =  MAIN_URL + '/partisipant';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: 'User berhasil didaftarkan'
                }
                var partisipant = res.data.results;
                var datakonsul = res.data.konsul;
                var pilihkonsul = res.data.pilihkonsul;
                var psikolog = res.data.psikolog;
                var selectkonsul = res.data.selectkonsul;
                res1.render('partisipant', {
                    partisipant: partisipant,
                    datakonsul: datakonsul,
                    pilihkonsul: pilihkonsul,
                    psikolog: psikolog,
                    selectkonsul: selectkonsul
                })
                req.session.idkonsul = null
            })
            .catch(function (err) {
                // console.log(err.response.data)
                // var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res1.redirect("/partisipant");
                req.session.idkonsul = null
            })

        } else {
            
            let res1 = res;
            url =  MAIN_URL + '/konsullist';
            axios.get(url)
            .then(function (res) {
                var konsul = res.data;
                res1.render('partisipant', {
                    datakonsul: konsul.data
                })
            })
            .catch(function (err) {
                // console.log(err);
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res1.redirect("/partisipant");
            })

        }
    } else {
        res.redirect('/login');
    }
});

/** Route for get partisipant list*/
Router.post('/partisipant', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul } = req.body;

        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/partisipant");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  MAIN_URL + '/partisipant';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var partisipant = res.data.results;
                    var datakonsul = res.data.konsul;
                    var pilihkonsul = res.data.pilihkonsul;
                    var psikolog = res.data.psikolog;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('partisipant', {
                        partisipant: partisipant,
                        datakonsul: datakonsul,
                        pilihkonsul: pilihkonsul,
                        psikolog: psikolog,
                        selectkonsul: selectkonsul
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    // var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Error, please contact developer'
                    }
                    res1.redirect("/partisipant");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong'
            }
            res.redirect("/partisipant");
        }

    } else {
        res.redirect('/login');
    }
});



/** Route for CRUD Soal */
Router.get('/soal', async (req, res) => {
    if(req.session.loggedIn){
        if(req.session.idkonsulinput != null){
            /** get data konsul berdasarkan id yang di pilih */
            params = {
                selectkonsul: req.session.idkonsulinput,
            }
            let res1 = res;
            url =  MAIN_URL + '/listsoal';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: 'Pertanyaan berhasil dibuat'
                }
                var pertanyaan = res.data.results;
                var datakonsul = res.data.konsul;
                var pilihkonsul = res.data.pilihkonsul;
                var selectkonsul = res.data.selectkonsul;
                res1.render('soal', {
                    pertanyaan: pertanyaan,
                    datakonsul: datakonsul,
                    pilihkonsul: pilihkonsul,
                    selectkonsul: selectkonsul
                })
                req.session.idkonsul = null
            })
            .catch(function (err) {
                // console.log(err.response.data)
                // var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res1.redirect("/soal");
                req.session.idkonsul = null
            })

        } else {
            
            let res1 = res;
            url =  MAIN_URL + '/konsullist';
            axios.get(url)
            .then(function (res) {
                var konsul = res.data;
                res1.render('soal', {
                    datakonsul: konsul.data
                })
            })
            .catch(function (err) {
                // console.log(err);
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res.redirect("/soal");
            })

        }
    } else {
        res.redirect('/login');
    }
});

/** Route for CRUD Soal */
Router.post('/soal', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul } = req.body;

        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/soal");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  MAIN_URL + '/listsoal';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var pertanyaan = res.data.results;
                    var datakonsul = res.data.konsul;
                    var pilihkonsul = res.data.pilihkonsul;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('soal', {
                        pertanyaan: pertanyaan,
                        datakonsul: datakonsul,
                        pilihkonsul: pilihkonsul,
                        selectkonsul: selectkonsul
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    // var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Error, please contact developer'
                    }
                    res1.redirect("/soal");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
            }
            res.redirect("/soal");
        }

    } else {
        res.redirect('/login');
    }
});

/** Route for CRUD Jawab */
Router.get('/jawab', async (req, res) => {
    if(req.session.loggedIn){
        if(req.session.idkonsulinput != null){
            /** get data konsul berdasarkan id yang di pilih */
            params = {
                selectkonsul: req.session.idkonsulinput,
            }
            let res1 = res;
            url =  MAIN_URL + '/listjawaban';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: 'Jawaban berhasil dibuat'
                }
                var jawaban = res.data.results;
                var datakonsul = res.data.konsul;
                var pilihkonsul = res.data.pilihkonsul;
                var selectkonsul = res.data.selectkonsul;
                res1.render('jawab', {
                    jawaban: jawaban,
                    datakonsul: datakonsul,
                    pilihkonsul: pilihkonsul,
                    selectkonsul: selectkonsul
                })
                req.session.idkonsul = null
            })
            .catch(function (err) {
                // console.log(err.response.data)
                // var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res1.redirect("/jawab");
                req.session.idkonsul = null
            })

        } else {
            
            let res1 = res;
            url =  MAIN_URL + '/konsullist';
            axios.get(url)
            .then(function (res) {
                var konsul = res.data;
                res1.render('jawab', {
                    datakonsul: konsul.data
                })
            })
            .catch(function (err) {
                // console.log(err);
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer'
                }
                res.redirect("/jawab");
            })

        }
    } else {
        res.redirect('/login');
    }
});

/** Route for CRUD Jawab */
Router.post('/jawab', async (req, res) => {
    if(req.session.loggedIn){
        
        const { selectkonsul } = req.body;

        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/jawab");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  MAIN_URL + '/listjawaban';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datakonsul = res.data.konsul;
                    var pilihkonsul = res.data.pilihkonsul;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('jawab', {
                        jawaban: jawaban,
                        datakonsul: datakonsul,
                        pilihkonsul: pilihkonsul,
                        selectkonsul: selectkonsul
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    // var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Error, please contact developer'
                    }
                    res1.redirect("/jawab");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
            }
            res.redirect("/jawab");
        }

    } else {
        res.redirect('/login');
    }
});

/** Route for assessmentuser */
Router.get('/assessmentuser', async (req, res) => {
    if(req.session.loggedIn){
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            if(req.session.loggedIn){
                if(req.session.idkonsulinput != null){
                    /** get data konsul berdasarkan id yang di pilih */
                    params = {
                        selectkonsul: req.session.idkonsulinput,
                    }
                    let res1 = res;
                    url =  MAIN_URL + '/listjawaban';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        req.session.sessionFlash2 = {
                            type: 'success',
                            message: 'Jawaban berhasil dibuat'
                        }
                        var jawaban = res.data.results;
                        var datakonsul = res.data.konsul;
                        var pilihkonsul = res.data.pilihkonsul;
                        var selectkonsul = res.data.selectkonsul;
                        res1.render('assessmentuser', {
                            jawaban: jawaban,
                            datakonsul: datakonsul,
                            pilihkonsul: pilihkonsul,
                            selectkonsul: selectkonsul
                        })
                        req.session.idkonsul = null
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        // var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer'
                        }
                        res1.redirect("/assessmentuser");
                        req.session.idkonsul = null
                    })
        
                } else {
                    
                    let res1 = res;
                    url =  MAIN_URL + '/konsullist';
                    axios.get(url)
                    .then(function (res) {
                        var konsul = res.data;
                        res1.render('assessmentuser', {
                            datakonsul: konsul.data
                        })
                    })
                    .catch(function (err) {
                        // console.log(err);
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer'
                        }
                        res.redirect("/assessmentuser");
                    })
        
                }
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');    
        }
    } else {
        res.redirect('/login');
    }
});

/** Route for assessmentuser */
Router.post('/assessmentuser', async (req, res) => {
    if(req.session.loggedIn){
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            const { selectkonsul } = req.body;

            if( selectkonsul ){
                if(selectkonsul == "-- Pilih Konsultasi --"){
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                    }
                    res.redirect("/assessmentuser");
                } else {
                    /** get data konsul berdasarkan id yang di pilih */
                    params = {
                        selectkonsul: selectkonsul,
                    }
                    let res1 = res;
                    url =  MAIN_URL + '/listjawaban';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var jawaban = res.data.results;
                        var datakonsul = res.data.konsul;
                        var pilihkonsul = res.data.pilihkonsul;
                        var selectkonsul = res.data.selectkonsul;
                        res1.render('assessmentuser', {
                            jawaban: jawaban,
                            datakonsul: datakonsul,
                            pilihkonsul: pilihkonsul,
                            selectkonsul: selectkonsul
                        })
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        // var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer'
                        }
                        res1.redirect("/assessmentuser");
                    })
                }
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/assessmentuser");
            }
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

/** Route for CRUD Assessment */
Router.get('/assessment', (req, res) => {
    res.render("assessment");
});

/** Route for CRUD Kesimpulan */
Router.get('/kesimpulan', (req, res) => {
    res.render("kesimpulan");
});

/** Router for logout */
Router.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

module.exports = Router;