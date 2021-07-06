const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
const Moment = require("moment");
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Route for Home */
Router.get('/', (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** login page di arhkan ke page user */
            res.render("indexuser",{
                username, nama, idu, tipe,
            });
        } else if(tipe === 'psikologis'){
            /** login page di arhkan ke page psikolog */
            res.render("index",{
                username, nama, idu, tipe,
            });
        } else if(tipe === 'admin'){
            /** login page di arhkan ke page admin */
            res.render("index",{
                username, nama, idu, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        let res1 = res;
        url = process.env.MAIN_URL + '/userlist';
        // url =  MAIN_URL + '/userlist';
        axios.get(url)
        .then(function (res) {
            var users = res.data;
            res1.render('users', {
                idu, username, nama, tipe,
                data: users.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message,
                idu, username, nama, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        let res1 = res;
        url =  process.env.MAIN_URL + '/konsullist';
        axios.get(url)
        .then(function (res) {
            var konsul = res.data;
            res1.render('konsul', {
                idu, username, nama, tipe,
                data: konsul.data
            })
        })
        .catch(function (err) {
            // console.log(err);
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message,
                idu, username, nama, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(req.session.idkonsulinput != null){
            /** get data konsul berdasarkan id yang di pilih */
            params = {
                selectkonsul: req.session.idkonsulinput,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/partisipant';
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
                    idu, username, nama, tipe,
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
                    message: 'Error, please contact developer',
                    idu, username, nama, tipe,
                }
                req.session.idkonsul = null
                res1.redirect("/partisipant");
            })

        } else {
            
            let res1 = res;
            url =  process.env.MAIN_URL + '/konsullist';
            axios.get(url)
            .then(function (res) {
                var konsul = res.data;
                res1.render('partisipant', {
                    idu, username, nama, tipe,
                    datakonsul: konsul.data
                })
            })
            .catch(function (err) {
                // console.log(err);
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer',
                    idu, username, nama, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
                    idu, username, nama, tipe,
                }
                res.redirect("/partisipant");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/partisipant';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var partisipant = res.data.results;
                    var datakonsul = res.data.konsul;
                    var pilihkonsul = res.data.pilihkonsul;
                    var psikolog = res.data.psikolog;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('partisipant', {
                        idu, username, nama, tipe,
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
                        message: 'Error, please contact developer',
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/partisipant");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong',
                idu, username, nama, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(req.session.idkonsulinput != null){
            /** get data konsul berdasarkan id yang di pilih */
            params = {
                selectkonsul: req.session.idkonsulinput,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/listsoal';
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
                    idu, username, nama, tipe,
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
                    message: 'Error, please contact developer',
                    idu, username, nama, tipe,
                }
                res1.redirect("/soal");
                req.session.idkonsul = null
            })

        } else {
            
            let res1 = res;
            url =  process.env.MAIN_URL + '/konsullist';
            axios.get(url)
            .then(function (res) {
                var konsul = res.data;
                res1.render('soal', {
                    idu, username, nama, tipe,
                    datakonsul: konsul.data
                })
            })
            .catch(function (err) {
                // console.log(err);
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Error, please contact developer',
                    idu, username, nama, tipe,
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
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
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
                url =  process.env.MAIN_URL + '/listsoal';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var pertanyaan = res.data.results;
                    var datakonsul = res.data.konsul;
                    var pilihkonsul = res.data.pilihkonsul;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('soal', {
                        idu, username, nama, tipe,
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
                        message: 'Error, please contact developer',
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/soal");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/soal");
        }

    } else {
        res.redirect('/login');
    }
});

/** Route for assessmentuser */
Router.get('/assessmentuser', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            if(req.session.loggedIn){
                if(req.session.idkonsulinput != null){
                    /** get data konsul berdasarkan id yang di pilih */
                    params = {
                        selectkonsul: req.session.idkonsulinput,
                        selectuser: idu
                    }
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/jawaban';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        req.session.sessionFlash2 = {
                            type: 'success',
                            message: 'Jawaban berhasil disimpan'
                        }
                        var jawaban = res.data.results;
                        var datakonsul = res.data.konsul;
                        var pilihkonsul = res.data.pilihkonsul;
                        var pertanyaan = res.data.pertanyaan;
                        var selectkonsul = res.data.selectkonsul;
                        // console.log(pertanyaan);
                        res1.render('assessmentuser', {
                            idu, username, nama, tipe,
                            jawaban: jawaban,
                            datakonsul: datakonsul,
                            pilihkonsul: pilihkonsul,
                            pertanyaan: pertanyaan,
                            selectkonsul: selectkonsul
                        })
                        req.session.idkonsul = null
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        // var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer',
                            idu, username, nama, tipe,
                        }
                        req.session.idkonsul = null
                        res1.redirect("/assessmentuser");
                    })
        
                } else {
                    
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/konsullist';
                    axios.get(url)
                    .then(function (res) {
                        var konsul = res.data;
                        res1.render('assessmentuser', {
                            idu, username, nama, tipe,
                            datakonsul: konsul.data
                        })
                    })
                    .catch(function (err) {
                        // console.log(err);
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer',
                            idu, username, nama, tipe,
                        }
                        res.redirect("/assessmentuser");
                    })
                    
                }
            } else {
                res.redirect('/login');
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe,
            }
            res.redirect('/login');    
        }
    } else {
        res.redirect('/login');
    }
});

/** Route for assessmentuser post */
Router.post('/assessmentuser', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
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
                        selectuser: idu
                    }
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/jawaban';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var jawaban = res.data.results;
                        var datakonsul = res.data.konsul;
                        var pilihkonsul = res.data.pilihkonsul;
                        var pertanyaan = res.data.pertanyaan;
                        var selectkonsul = res.data.selectkonsul;
                        res1.render('assessmentuser', {
                            idu, username, nama, tipe,
                            jawaban: jawaban,
                            datakonsul: datakonsul,
                            pilihkonsul: pilihkonsul,
                            pertanyaan: pertanyaan,
                            selectkonsul: selectkonsul
                        })
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        // var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer',
                            idu, username, nama, tipe,
                        }
                        res1.redirect("/assessmentuser");
                    })
                }
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
                    idu, username, nama, tipe,
                }
                res.redirect("/assessmentuser");
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized'
            }
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

/** hasil assessment */
Router.get('/hasilassessment', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            if(req.session.idkonsulinput != null){
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: req.session.idkonsulinput,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listhasil';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var peserta = res.data.results;
                        var datakonsul = res.data.konsul;
                        var selectkonsul = res.data.selectkonsul;
                        res1.render('hasilassessment', {
                            idu, username, nama, tipe,
                            datapeserta: peserta,
                            datakonsul: datakonsul,
                            selectkonsul: selectkonsul
                        })
                        req.session.idkonsulinput = null
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe,
                        }
                        req.session.idkonsulinput = null
                        res1.redirect("/hasilassessment");
                    })
            } else {
                let res1 = res;
                url =  process.env.MAIN_URL + '/konsullist';
                axios.get(url)
                .then(function (res) {
                    var konsul = res.data;
                    res1.render('hasilassessment', {
                        idu, username, nama, tipe,
                        datakonsul: konsul.data
                    })
                })
                .catch(function (err) {
                    // console.log(err);
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res.redirect("/hasilassessment");
                })
    
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized'
            }
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

Router.post('/hasilassessment', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/hasilassessment");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listhasil';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var peserta = res.data.results;
                    var datakonsul = res.data.konsul;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('hasilassessment', {
                        idu, username, nama, tipe,
                        datapeserta: peserta,
                        datakonsul: datakonsul,
                        selectkonsul: selectkonsul
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/hasilassessment");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/hasilassessment");
        }

    } else {
        res.redirect('/login');
    }
});

Router.post('/hasilassessmentpeserta', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul, selectpeserta } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( selectkonsul && selectpeserta){
            if(selectkonsul == "-- Pilih Konsul --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/soal");
            } else if (selectpeserta == "-- Pilih Peserta --"){
                eq.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Peserta Terlebih Dahulu!'
                }
                res.redirect("/hasilassessment");
            } else {
                params = {
                    selectkonsul: selectkonsul,
                    selectpeserta: selectpeserta,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listhasilpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datakonsul = res.data.konsul;
                    var selectkonsul = res.data.selectkonsul;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    res1.render('hasilassessment', {
                        idu, username, nama, tipe,
                        jawaban: jawaban,
                        datakonsul: datakonsul,
                        selectkonsul: selectkonsul,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/hasilassessment");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi dan Peserta Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/hasilassessment");
        }

    } else {
        res.redirect('/login');
    }
});

/** kesimpulan assessment */
Router.get('/kesimpulanassessment', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            if(req.session.idkonsulinput != null){
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: req.session.idkonsulinput,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listkesimpulan';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var peserta = res.data.results;
                        var datakonsul = res.data.konsul;
                        var selectkonsul = res.data.selectkonsul;
                        res1.render('kesimpulanassessment', {
                            idu, username, nama, tipe,
                            datapeserta: peserta,
                            datakonsul: datakonsul,
                            selectkonsul: selectkonsul
                        })
                        req.session.idkonsulinput = null
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe,
                        }
                        req.session.idkonsulinput = null
                        res1.redirect("/kesimpulanassessment");
                    })
            } else {
                let res1 = res;
                url =  process.env.MAIN_URL + '/konsullist';
                axios.get(url)
                .then(function (res) {
                    var konsul = res.data;
                    res1.render('kesimpulanassessment', {
                        idu, username, nama, tipe,
                        datakonsul: konsul.data
                    })
                })
                .catch(function (err) {
                    // console.log(err);
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res.redirect("/kesimpulanassessment");
                })
    
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized'
            }
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

Router.post('/kesimpulanassessment', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( selectkonsul ){
            if(selectkonsul == "-- Pilih Konsultasi --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/kesimpulanassessment");
            } else {
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectkonsul: selectkonsul,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listkesimpulan';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var peserta = res.data.results;
                    var datakonsul = res.data.konsul;
                    var selectkonsul = res.data.selectkonsul;
                    res1.render('kesimpulanassessment', {
                        idu, username, nama, tipe,
                        datapeserta: peserta,
                        datakonsul: datakonsul,
                        selectkonsul: selectkonsul
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/kesimpulanassessment");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/kesimpulanassessment");
        }

    } else {
        res.redirect('/login');
    }
});

Router.get('/kesimpulanassessmentpeserta', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( req.session.idkonsulinput && req.session.idpesertainput){
            if(req.session.idkonsulinput == "-- Pilih Konsul --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/soal");
            } else if (req.session.idpesertainput == "-- Pilih Peserta --"){
                eq.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Peserta Terlebih Dahulu!'
                }
                res.redirect("/kesimpulanassessment");
            } else {
                params = {
                    selectkonsul: req.session.idkonsulinput,
                    selectpeserta: req.session.idpesertainput,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listkesimpulanpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datakonsul = res.data.konsul;
                    var datakesimpulan = res.data.datakesimpulan;
                    var selectkonsul = res.data.selectkonsul;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    res1.render('kesimpulanassessment', {
                        idu, username, nama, tipe,
                        jawaban: jawaban,
                        datakonsul: datakonsul,
                        selectkonsul: selectkonsul,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        datakesimpulan: datakesimpulan
                    })
                    req.session.idkonsulinput = null
                    req.session.idpesertainput = null
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    req.session.idkonsulinput = null
                    req.session.idpesertainput = null
                    res1.redirect("/kesimpulanassessment");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!',
                idu, username, nama, tipe,
            }
            res.redirect("/kesimpulanassessment");
        }
    } else {
        res.redirect('/login');
    }
});

Router.post('/kesimpulanassessmentpeserta', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        
        const { selectkonsul, selectpeserta } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if( selectkonsul && selectpeserta){
            if(selectkonsul == "-- Pilih Konsul --"){
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
                }
                res.redirect("/soal");
            } else if (selectpeserta == "-- Pilih Peserta --"){
                eq.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Peserta Terlebih Dahulu!'
                }
                res.redirect("/kesimpulanassessment");
            } else {
                params = {
                    selectkonsul: selectkonsul,
                    selectpeserta: selectpeserta,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/listkesimpulanpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datakonsul = res.data.konsul;
                    var datakesimpulan = res.data.datakesimpulan;
                    var selectkonsul = res.data.selectkonsul;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    res1.render('kesimpulanassessment', {
                        idu, username, nama, tipe,
                        jawaban: jawaban,
                        datakonsul: datakonsul,
                        selectkonsul: selectkonsul,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        datakesimpulan: datakesimpulan
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe,
                    }
                    res1.redirect("/kesimpulanassessment");
                })
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Konsultasi dan Peserta Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/kesimpulanassessment");
        }

    } else {
        res.redirect('/login');
    }
});

/** Route for profile */
Router.get('/accountsetting', (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        email = req.session.email
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan' || tipe === 'peserta' || tipe === 'peserta_event'){
            res.render("profile",{
                idu, username, nama, tipe, email
            });
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized'
            }
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

/** Router for logout */
Router.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

module.exports = Router;