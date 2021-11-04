const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
const Moment = require("moment");
const nodemailer = require('nodemailer');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
useragent = require('express-useragent');
// process.env.MAIN_URL

require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** set up mail sender */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
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

/** Route for Register */
Router.get('/register', (req, res) => {
    res.render("register");
});

/** Route for Home */
Router.get('/', (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** login page di arhkan ke page user */
            res.render("indexuser2",{
                username, nama, idu, tipe,
            });
        } else if(tipe === 'psikologis'){
            /** login page di arhkan ke page psikolog */
            res.render("index2",{
                username, nama, idu, tipe,
            });
        } else if(tipe === 'admin'){
            /** login page di arhkan ke page admin */
            res.render("index2",{
                username, nama, idu, tipe,
            });
        }
    } else {
        res.redirect('/login');
    }
});

/** Route for konsultasi karir */
Router.get('/konsultasikarir', (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** login page di arahkan ke page assessment awal karir */
            res.redirect('/assessmentuserkarir');
        } else if(tipe === 'psikologis'){
            /** login page di arahkan ke page hasil assessment karir */
            res.redirect('/hasilassessmentkarir');
        } else if(tipe === 'admin'){
            /** login page di arahkan ke page hasil assessment karir */
            res.redirect('/hasilassessmentkarir');
        }
    } else {
        res.redirect('/login');
    }
})


/** Route for konsultasi kepribadian */
Router.get('/konsultasikepribadian', (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** login page di arahkan ke page assessment awal kepribadian */
            res.redirect('/assessmentuserkepribadian');
        } else if(tipe === 'psikologis'){
            /** login page di arahkan ke page skoring kepribadian */
            res.redirect('/skoringkepribadian');
        } else if(tipe === 'admin'){
            /** login page di arahkan ke page skoring kepribadian */
            res.redirect('/skoringkepribadian');
        }
    } else {
        res.redirect('/login');
    }
})

/** Route for get user list */
Router.get('/users', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin'){
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
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe
            }
            res.redirect('/login');  
        }
    } else {
        res.redirect('/login');
    }
})

/** Route for get Konsul/Event list*/
// Router.get('/konsul', async (req, res) => { 
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         let res1 = res;
//         url =  process.env.MAIN_URL + '/konsullist';
//         axios.get(url)
//         .then(function (res) {
//             var konsul = res.data;
//             res1.render('konsul', {
//                 idu, username, nama, tipe,
//                 data: konsul.data
//             })
//         })
//         .catch(function (err) {
//             // console.log(err);
//             var message = err.response.data.message;
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: message,
//                 idu, username, nama, tipe,
//             }
//             res1.redirect("/konsul");
//         })
//     } else {
//         res.redirect('/login');
//     }
// })

/** Route for get partisipant list*/
// Router.get('/partisipant', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(req.session.idkonsulinput != null){
//             /** get data konsul berdasarkan id yang di pilih */
//             params = {
//                 selectkonsul: req.session.idkonsulinput,
//             }
//             let res1 = res;
//             url =  process.env.MAIN_URL + '/partisipant';
//             var dataputs = await axios.post(url, params)
//             .then(function (res) {
//                 req.session.sessionFlash2 = {
//                     type: 'success',
//                     message: 'User berhasil didaftarkan'
//                 }
//                 var partisipant = res.data.results;
//                 var datakonsul = res.data.konsul;
//                 var pilihkonsul = res.data.pilihkonsul;
//                 var psikolog = res.data.psikolog;
//                 var selectkonsul = res.data.selectkonsul;
//                 res1.render('partisipant', {
//                     idu, username, nama, tipe,
//                     partisipant: partisipant,
//                     datakonsul: datakonsul,
//                     pilihkonsul: pilihkonsul,
//                     psikolog: psikolog,
//                     selectkonsul: selectkonsul
//                 })
//                 req.session.idkonsul = null
//             })
//             .catch(function (err) {
//                 // console.log(err.response.data)
//                 // var message = err.response.data.message;
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Error, please contact developer',
//                     idu, username, nama, tipe,
//                 }
//                 req.session.idkonsul = null
//                 res1.redirect("/partisipant");
//             })

//         } else {
            
//             let res1 = res;
//             url =  process.env.MAIN_URL + '/konsullist';
//             axios.get(url)
//             .then(function (res) {
//                 var konsul = res.data;
//                 res1.render('partisipant', {
//                     idu, username, nama, tipe,
//                     datakonsul: konsul.data
//                 })
//             })
//             .catch(function (err) {
//                 // console.log(err);
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Error, please contact developer',
//                     idu, username, nama, tipe,
//                 }
//                 res1.redirect("/partisipant");
//             })

//         }
//     } else {
//         res.redirect('/login');
//     }
// });

/** Route for get partisipant list*/
// Router.post('/partisipant', async (req, res, dataputs) => {
//     if(req.session.loggedIn){
        
//         const { selectkonsul } = req.body;
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if( selectkonsul ){
//             if(selectkonsul == "-- Pilih Konsultasi --"){
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
//                     idu, username, nama, tipe,
//                 }
//                 res.redirect("/partisipant");
//             } else {
//                 /** get data konsul berdasarkan id yang di pilih */
//                 params = {
//                     selectkonsul: selectkonsul,
//                 }
//                 let res1 = res;
//                 url =  process.env.MAIN_URL + '/partisipant';
//                 var dataputs = await axios.post(url, params)
//                 .then(function (res) {
//                     var partisipant = res.data.results;
//                     var datakonsul = res.data.konsul;
//                     var pilihkonsul = res.data.pilihkonsul;
//                     var psikolog = res.data.psikolog;
//                     var selectkonsul = res.data.selectkonsul;
//                     res1.render('partisipant', {
//                         idu, username, nama, tipe,
//                         partisipant: partisipant,
//                         datakonsul: datakonsul,
//                         pilihkonsul: pilihkonsul,
//                         psikolog: psikolog,
//                         selectkonsul: selectkonsul
//                     })
//                 })
//                 .catch(function (err) {
//                     // console.log(err.response.data)
//                     // var message = err.response.data.message;
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Error, please contact developer',
//                         idu, username, nama, tipe,
//                     }
//                     res1.redirect("/partisipant");
//                 })
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Field tidak boleh kosong',
//                 idu, username, nama, tipe,
//             }
//             res.redirect("/partisipant");
//         }

//     } else {
//         res.redirect('/login');
//     }
// });

/** Route for CRUD Soal */
// Router.get('/soal', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(req.session.idkonsulinput != null){
//             /** get data konsul berdasarkan id yang di pilih */
//             params = {
//                 selectkonsul: req.session.idkonsulinput,
//             }
//             let res1 = res;
//             url =  process.env.MAIN_URL + '/listsoal';
//             var dataputs = await axios.post(url, params)
//             .then(function (res) {
//                 req.session.sessionFlash2 = {
//                     type: 'success',
//                     message: 'Pertanyaan berhasil dibuat'
//                 }
//                 var pertanyaan = res.data.results;
//                 var datakonsul = res.data.konsul;
//                 var pilihkonsul = res.data.pilihkonsul;
//                 var selectkonsul = res.data.selectkonsul;
//                 res1.render('soal', {
//                     idu, username, nama, tipe,
//                     pertanyaan: pertanyaan,
//                     datakonsul: datakonsul,
//                     pilihkonsul: pilihkonsul,
//                     selectkonsul: selectkonsul
//                 })
//                 req.session.idkonsul = null
//             })
//             .catch(function (err) {
//                 // console.log(err.response.data)
//                 // var message = err.response.data.message;
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Error, please contact developer',
//                     idu, username, nama, tipe,
//                 }
//                 res1.redirect("/soal");
//                 req.session.idkonsul = null
//             })

//         } else {
            
//             let res1 = res;
//             url =  process.env.MAIN_URL + '/konsullist';
//             axios.get(url)
//             .then(function (res) {
//                 var konsul = res.data;
//                 res1.render('soal', {
//                     idu, username, nama, tipe,
//                     datakonsul: konsul.data
//                 })
//             })
//             .catch(function (err) {
//                 // console.log(err);
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Error, please contact developer',
//                     idu, username, nama, tipe,
//                 }
//                 res.redirect("/soal");
//             })

//         }
//     } else {
//         res.redirect('/login');
//     }
// });

/** Route for CRUD Soal */
// Router.post('/soal', async (req, res, dataputs) => {
//     if(req.session.loggedIn){
        
//         const { selectkonsul } = req.body;
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if( selectkonsul ){
//             if(selectkonsul == "-- Pilih Konsultasi --"){
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
//                 }
//                 res.redirect("/soal");
//             } else {
//                 /** get data konsul berdasarkan id yang di pilih */
//                 params = {
//                     selectkonsul: selectkonsul,
//                 }
//                 let res1 = res;
//                 url =  process.env.MAIN_URL + '/listsoal';
//                 var dataputs = await axios.post(url, params)
//                 .then(function (res) {
//                     var pertanyaan = res.data.results;
//                     var datakonsul = res.data.konsul;
//                     var pilihkonsul = res.data.pilihkonsul;
//                     var selectkonsul = res.data.selectkonsul;
//                     res1.render('soal', {
//                         idu, username, nama, tipe,
//                         pertanyaan: pertanyaan,
//                         datakonsul: datakonsul,
//                         pilihkonsul: pilihkonsul,
//                         selectkonsul: selectkonsul
//                     })
//                 })
//                 .catch(function (err) {
//                     // console.log(err.response.data)
//                     // var message = err.response.data.message;
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Error, please contact developer',
//                         idu, username, nama, tipe,
//                     }
//                     res1.redirect("/soal");
//                 })
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
//                 idu, username, nama, tipe,
//             }
//             res.redirect("/soal");
//         }

//     } else {
//         res.redirect('/login');
//     }
// });

/** Route for assessment karir user */
Router.get('/assessmentuserkarir', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** tipe konsultasi karir */
            params = {
                selectuser: idu,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/listpartkarir';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var datapart = res.data.datapart;
                if(res.data.selectsesi){
                    var selectsesi = res.data.selectsesi[0].id_sesi;
                    res1.render('assessmentuserkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        selectsesi
                    })
                } else {
                    res1.render('assessmentuserkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        datapart: datapart
                    })
                }
            })
            .catch(function (error) {
                if(error.response){
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    } 
                    res1.redirect('/');
                } else if(error.request){
                    var message = err.request;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    }
                    res1.redirect('/');
                } else {
                    var message = error.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe
                    }
                    res1.redirect('/');
                }
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe
            }
            res.redirect('/login');   
        }
    } else {
        res.redirect('/login');   
    }
});

/** Route for assessment user karir */
Router.post('/assessmentuserkarir', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            const { selectpart } = req.body;
            if( selectpart){
                    params = {
                        selectpart: selectpart,
                        selectuser: idu
                    }
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/listsoalkarir';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var datasoal = res.data.soal;
                        var datasesi = res.data.sesi;
                        var datapart = res.data.datapart;
                        var selectpart = res.data.selectpart;
                        res1.render('assessmentuserkarir', {
                            idu, username, nama, tipe, tipekonsultasi,
                            datasoal: datasoal,
                            datasesi: datasesi,
                            datapart: datapart,
                            selectpart: selectpart
                        })
                    })
                    .catch(function (err) {
                        // console.log(err.response.data)
                        // var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Error, please contact developer',
                            idu, username, nama, tipe, tipekonsultasi,
                        }
                        res1.redirect("/assessmentuserkarir");
                    })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap Pilih Klasifikasi Konsultasi Terlebih Dahulu!',
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res.redirect("/assessmentuserkarir");
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

/** Route for assessment karir user */
Router.get('/assessmentuserkepribadian', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            /** tipe konsultasi karir */
            params = {
                idu: idu,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/listpertanyaankepribadian';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var partpertanyaan = res.data.partpertanyaan;
                if(partpertanyaan === '1'){
                    var data = res.data.pertanyaan_part1;
                } else if(partpertanyaan === '2'){
                    var data = res.data.pertanyaan_part2;
                } else if(partpertanyaan === '3'){
                    var data = res.data.pertanyaan_part3;
                } else if(partpertanyaan === '4'){
                    var data = res.data.pertanyaan_part4;
                } else if(partpertanyaan === '5'){
                    var data = res.data.pertanyaan_part5;
                }
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.render('assessmentuserkepribadian', {
                    idu, username, nama, tipe, tipekonsultasi,
                    data: data,
                    partpertanyaan
                })
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe
                }
                res1.redirect('/');
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe
            }
            res.redirect('/login');   
        }
    } else {
        res.redirect('/login');   
    }
});


/** Route for assessmentuser */
// Router.get('/assessmentuser', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(tipe === 'peserta' || tipe === 'peserta_event'){
//             if(req.session.idkonsul != null){
//                 /** session id tidak kosong */
//                 if(req.session.idkonsul === '3'){
//                     /** tipe konsultasi test kepribadian/SAPA */
//                     /** get data acara berdasarkan id yang di pilih */
//                     params = {
//                         selectkonsul: req.session.idkonsul,
//                         idu: idu,
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/listpertanyaan2';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var selectkonsul = res.data.selectkonsul;
//                         var datakonsul = res.data.datakonsul;
//                         var partpertanyaan = res.data.partpertanyaan;
//                         if(partpertanyaan === '1'){
//                             var data = res.data.pertanyaan_part1;
//                         } else if(partpertanyaan === '2'){
//                             var data = res.data.pertanyaan_part2;
//                         } else if(partpertanyaan === '3'){
//                             var data = res.data.pertanyaan_part3;
//                         } else if(partpertanyaan === '4'){
//                             var data = res.data.pertanyaan_part4;
//                         } else if(partpertanyaan === '5'){
//                             var data = res.data.pertanyaan_part5;
//                         }
//                         var message = res.data.message;
//                         req.session.sessionFlash2 = {
//                             type: 'success',
//                             message: message
//                         }
                        
//                         res1.render('assessmentmahasiswa', {
//                             idu, username, nama, tipe,
//                             data: data,
//                             selectkonsul,
//                             datakonsul,
//                             partpertanyaan
//                         })
//                     })
//                     .catch(function (err) {
//                         var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: message
//                         }
//                         res1.redirect("/assessmentuser");
//                     })
//                 }
//             } else {
//                 /** session idkonsul kosong */
//                 let res1 = res;
//                 url =  process.env.MAIN_URL + '/konsullist';
//                 axios.get(url)
//                 .then(function (res) {
//                     var konsul = res.data;
//                     res1.render('assessmentuser2', {
//                         idu, username, nama, tipe,
//                         datakonsul: konsul.data
//                     })
//                 })
//                 .catch(function (err) {
//                     // console.log(err);
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Error, please contact developer',
//                         idu, username, nama, tipe,
//                     }
//                     res.redirect("/assessmentuser");
//                 })
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Not Authorized',
//                 idu, username, nama, tipe,
//             }
//             res.redirect('/login');    
//         }
//     } else {
//         res.redirect('/login');
//     }  
// });

/** Route for assessmentuser post */
// Router.post('/assessmentuser', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(tipe === 'peserta' || tipe === 'peserta_event'){
//             const { selectkonsul } = req.body;

//             if( selectkonsul ){
//                 if(selectkonsul == "-- Pilih Konsultasi --"){
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
//                     }
//                     res.redirect("/assessmentuser");
//                 } else if(selectkonsul === '1'){
//                     /** tipe konsultasi karir */
//                     params = {
//                         selectkonsul: selectkonsul,
//                         selectuser: idu
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/listpart';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var datapart = res.data.datapart;
//                         var datakonsul = res.data.konsul;
//                         var pilihkonsul = res.data.pilihkonsul;
//                         var selectkonsul = res.data.selectkonsul;
//                         res1.render('assessmentuser2', {
//                             idu, username, nama, tipe,
//                             datapart: datapart,
//                             datakonsul: datakonsul,
//                             pilihkonsul: pilihkonsul,
//                             selectkonsul: selectkonsul
//                         })
//                     })
//                     .catch(function (err) {
//                         // console.log(err.response.data)
//                         var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: message,
//                             idu, username, nama, tipe,
//                         }
//                         res1.redirect("/assessmentuser");
//                     })
//                 } else if(selectkonsul === '2'){
//                     /** tipe konsultasi reguler */
                    

//                 } else if(selectkonsul === '3'){
//                     /** tipe konsultasi test kepribadian/SAPA */
//                     /** get data acara berdasarkan id yang di pilih */
//                     params = {
//                         selectkonsul: selectkonsul,
//                         idu: idu,
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/listpertanyaan2';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var selectkonsul = res.data.selectkonsul;
//                         var datakonsul = res.data.datakonsul;
//                         var partpertanyaan = res.data.partpertanyaan;
//                         if(partpertanyaan === '1'){
//                             var data = res.data.pertanyaan_part1;
//                         } else if(partpertanyaan === '2'){
//                             var data = res.data.pertanyaan_part2;
//                         } else if(partpertanyaan === '3'){
//                             var data = res.data.pertanyaan_part3;
//                         } else if(partpertanyaan === '4'){
//                             var data = res.data.pertanyaan_part4;
//                         } else if(partpertanyaan === '5'){
//                             var data = res.data.pertanyaan_part5;
//                         }
//                         var message = res.data.message;
//                         req.session.sessionFlash2 = {
//                             type: 'success',
//                             message: message
//                         }
                        
//                         res1.render('assessmentmahasiswa', {
//                             idu, username, nama, tipe,
//                             data: data,
//                             selectkonsul,
//                             datakonsul,
//                             partpertanyaan
//                         })
//                     })
//                     .catch(function (err) {
//                         var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: message
//                         }
//                         res1.redirect("/assessmentuser");
//                     })
//                 }
//             } else {
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
//                     idu, username, nama, tipe,
//                 }
//                 res.redirect("/assessmentuser");
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Not Authorized'
//             }
//             res.redirect('/login');
//         }
//     } else {
//         res.redirect('/login');
//     }
// });

/** Route for assessmentuser_klasifikasi post */
// Router.post('/assessmentuser_klasifikasi', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(tipe === 'peserta' || tipe === 'peserta_event'){
//             const { selectpart, tipekonsul } = req.body;

//             if( selectpart && tipekonsul){
//                 if(selectpart == "-- Pilih Klasifikasi Konsultasi --"){
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Harap Pilih Klasifikasi Konsultasi Terlebih Dahulu!'
//                     }
//                     res.redirect("/assessmentuser");
//                 } else if(tipekonsul == "-- Pilih Konsultasi --"){
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Harap Pilih Tipe Konsultasi Terlebih Dahulu!'
//                     }
//                     res.redirect("/assessmentuser");
//                 } else {
//                     params = {
//                         selectpart: selectpart,
//                         selectkonsul: tipekonsul,
//                         selectuser: idu
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/listsoal2';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var datasoal = res.data.soal;
//                         var datapart = res.data.datapart;
//                         var datakonsul = res.data.konsul;
//                         var pilihkonsul = res.data.pilihkonsul;
//                         var selectkonsul = res.data.selectkonsul;
//                         var selectpart = res.data.selectpart;
//                         res1.render('assessmentuser2', {
//                             idu, username, nama, tipe,
//                             datasoal: datasoal,
//                             datapart: datapart,
//                             datakonsul: datakonsul,
//                             pilihkonsul: pilihkonsul,
//                             selectkonsul: selectkonsul,
//                             selectpart: selectpart
//                         })
//                     })
//                     .catch(function (err) {
//                         // console.log(err.response.data)
//                         // var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: 'Error, please contact developer',
//                             idu, username, nama, tipe,
//                         }
//                         res1.redirect("/assessmentuser");
//                     })
//                 }
//             } else {
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Klasifikasi Konsultasi Terlebih Dahulu!',
//                     idu, username, nama, tipe,
//                 }
//                 res.redirect("/assessmentuser");
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Not Authorized'
//             }
//             res.redirect('/login');
//         }
//     } else {
//         res.redirect('/login');
//     }
// });

// Router.get('/assessmentuser', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(tipe === 'peserta' || tipe === 'peserta_event'){
//             if(req.session.loggedIn){
//                 if(req.session.idkonsulinput != null){
//                     /** get data konsul berdasarkan id yang di pilih */
//                     params = {
//                         selectkonsul: req.session.idkonsulinput,
//                         selectuser: idu
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/jawaban';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         req.session.sessionFlash2 = {
//                             type: 'success',
//                             message: 'Jawaban berhasil disimpan'
//                         }
//                         var jawaban = res.data.results;
//                         var datakonsul = res.data.konsul;
//                         var pilihkonsul = res.data.pilihkonsul;
//                         var pertanyaan = res.data.pertanyaan;
//                         var selectkonsul = res.data.selectkonsul;
//                         // console.log(pertanyaan);
//                         res1.render('assessmentuser', {
//                             idu, username, nama, tipe,
//                             jawaban: jawaban,
//                             datakonsul: datakonsul,
//                             pilihkonsul: pilihkonsul,
//                             pertanyaan: pertanyaan,
//                             selectkonsul: selectkonsul
//                         })
//                         req.session.idkonsul = null
//                     })
//                     .catch(function (err) {
//                         // console.log(err.response.data)
//                         // var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: 'Error, please contact developer',
//                             idu, username, nama, tipe,
//                         }
//                         req.session.idkonsul = null
//                         res1.redirect("/assessmentuser");
//                     })
        
//                 } else {
                    
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/konsullist';
//                     axios.get(url)
//                     .then(function (res) {
//                         var konsul = res.data;
//                         res1.render('assessmentuser', {
//                             idu, username, nama, tipe,
//                             datakonsul: konsul.data
//                         })
//                     })
//                     .catch(function (err) {
//                         // console.log(err);
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: 'Error, please contact developer',
//                             idu, username, nama, tipe,
//                         }
//                         res.redirect("/assessmentuser");
//                     })
                    
//                 }
//             } else {
//                 res.redirect('/login');
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Not Authorized',
//                 idu, username, nama, tipe,
//             }
//             res.redirect('/login');    
//         }
//     } else {
//         res.redirect('/login');
//     }
// });

// /** Route for assessmentuser post */
// Router.post('/assessmentuser', async (req, res) => {
//     if(req.session.loggedIn){
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if(tipe === 'peserta' || tipe === 'peserta_event'){
//             const { selectkonsul } = req.body;

//             if( selectkonsul ){
//                 if(selectkonsul == "-- Pilih Konsultasi --"){
//                     req.session.sessionFlash = {
//                         type: 'error',
//                         message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
//                     }
//                     res.redirect("/assessmentuser");
//                 } else {
//                     /** get data konsul berdasarkan id yang di pilih */
//                     params = {
//                         selectkonsul: selectkonsul,
//                         selectuser: idu
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/jawaban';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var jawaban = res.data.results;
//                         var datakonsul = res.data.konsul;
//                         var pilihkonsul = res.data.pilihkonsul;
//                         var pertanyaan = res.data.pertanyaan;
//                         var selectkonsul = res.data.selectkonsul;
//                         res1.render('assessmentuser', {
//                             idu, username, nama, tipe,
//                             jawaban: jawaban,
//                             datakonsul: datakonsul,
//                             pilihkonsul: pilihkonsul,
//                             pertanyaan: pertanyaan,
//                             selectkonsul: selectkonsul
//                         })
//                     })
//                     .catch(function (err) {
//                         // console.log(err.response.data)
//                         // var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: 'Error, please contact developer',
//                             idu, username, nama, tipe,
//                         }
//                         res1.redirect("/assessmentuser");
//                     })
//                 }
//             } else {
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
//                     idu, username, nama, tipe,
//                 }
//                 res.redirect("/assessmentuser");
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Not Authorized'
//             }
//             res.redirect('/login');
//         }
//     } else {
//         res.redirect('/login');
//     }
// });

/** hasil assessment karir */
Router.get('/hasilassessmentkarir', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            let res1 = res;
            url =  process.env.MAIN_URL + '/hasilassessmentkarir';
            var dataputs = await axios.get(url)
            .then(function (res) {
                var datasesi = res.data.sesi;
                res1.render('hasilassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    datasesi,
                })
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res1.redirect("/");
            })
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

Router.post('/hasilassessmentkarirsesi', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        const { selectsesi } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectsesi){
                params = {
                    selectsesi: selectsesi,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/hasilassessmentkarirsesi';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var datapeserta = res.data.results;
                    var datasesi = res.data.sesi;
                    var selectsesi = res.data.selectsesi;
                    res1.render('hasilassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        datapeserta,
                        datasesi,
                        selectsesi
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe, tipekonsultasi
                    }
                    res1.redirect("/hasilassessmentkarir");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Peserta Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/hasilassessmentkarir");
        }

    } else {
        res.redirect('/login');
    }
});

// Router.post('/hasilassessment', async (req, res, dataputs) => {
//     if(req.session.loggedIn){
        
//         const { selectkonsul } = req.body;
        
//         idu = req.session.iduser
//         username = req.session.username
//         nama = req.session.nama
//         tipe = req.session.type
//         if( selectkonsul ){
//             if(selectkonsul == "-- Pilih Konsultasi --"){
//                 req.session.sessionFlash = {
//                     type: 'error',
//                     message: 'Harap Pilih Konsultasi Terlebih Dahulu!'
//                 }
//                 res.redirect("/hasilassessment");
//             } else {
//                 if(selectkonsul === '1'){
//                     /** konsutlasi karir */
//                     /** get data konsul berdasarkan id yang di pilih */
//                     params = {
//                         selectkonsul: selectkonsul,
//                     }
//                     let res1 = res;
//                     url =  process.env.MAIN_URL + '/listhasil';
//                     var dataputs = await axios.post(url, params)
//                     .then(function (res) {
//                         var peserta = res.data.results;
//                         var datakonsul = res.data.konsul;
//                         var selectkonsul = res.data.selectkonsul;
//                         res1.render('hasilassessment', {
//                             idu, username, nama, tipe,
//                             datapeserta: peserta,
//                             datakonsul: datakonsul,
//                             selectkonsul: selectkonsul
//                         })
//                     })
//                     .catch(function (err) {
//                         // console.log(err.response.data)
//                         var message = err.response.data.message;
//                         req.session.sessionFlash = {
//                             type: 'error',
//                             message: message,
//                             idu, username, nama, tipe,
//                         }
//                         res1.redirect("/hasilassessment");
//                     })
//                 } else if(selectkonsul === '2'){
//                     /** konsultasi reguler */

//                 } else if( selectkonsul === '3'){
//                     /** konsultasi kepribadian */
//                     // params = {
//                     //     selectkonsul: selectkonsul,
//                     // }
//                     // let res1 = res;
//                     // url =  process.env.MAIN_URL + '/hasilassessmentkepribadian';
//                     // var dataputs = await axios.post(url, params)
//                     // .then(function (res) {
//                     //     var data = res.data.resultcekpeserta;
//                     //     var selectkonsul = res.data.selectkonsul;
//                     //     var selectpeserta = res.data.selectpeserta;
//                     //     var datakonsul = res.data.datakonsul;
//                     //     var message = res.data.message;
//                     //     req.session.sessionFlash2 = {
//                     //         type: 'success',
//                     //         message: message
//                     //     }
//                     //     res1.render('hasilassessmentkepribadian', {
//                     //         idu, username, nama, tipe,
//                     //         data: data,
//                     //         selectkonsul,
//                     //         datakonsul,
//                     //         selectpeserta
//                     //     })
//                     // })
//                     // .catch(function (err) {
//                     //     var message = err.response.data.message;
//                     //     req.session.sessionFlash = {
//                     //         type: 'error',
//                     //         message: message
//                     //     }
//                     //     res1.redirect("/hasilassessment");
//                     // })
//                 }
//             }
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Harap Pilih Konsultasi Terlebih Dahulu!',
//                 idu, username, nama, tipe,
//             }
//             res.redirect("/hasilassessment");
//         }

//     } else {
//         res.redirect('/login');
//     }
// });

Router.post('/hasilassessmentkarir', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        const { selectpeserta, selectsesi } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectpeserta && selectsesi ){
                params = {
                    selectpeserta: selectpeserta,
                    selectsesi: selectsesi
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/hasilassessmentkarirpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    var biodata = res.data.biodata;
                    var datasesi = res.data.sesi;
                    var selectsesi = res.data.selectsesi;
                    res1.render('hasilassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        jawaban: jawaban,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        biodata: biodata,
                        datasesi,
                        selectsesi
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe, tipekonsultasi
                    }
                    res1.redirect("/hasilassessmentkarir");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Peserta Terlebih Dahulu!',
                idu, username, nama, tipe,
            }
            res.redirect("/hasilassessmentkarir");
        }

    } else {
        res.redirect('/login');
    }
});

/** kesimpulan assessment */
Router.get('/kesimpulanassessmentkarir', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            if(req.session.idpesertainput != null && req.session.idsesiinput != null){
                /** redirect after edit kesimpulan */
                /** konsultasi karir */
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectpeserta: req.session.idpesertainput,
                    selectsesi: req.session.idsesiinput,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkarirpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datakesimpulan = res.data.datakesimpulan;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    var biodata = res.data.biodata;
                    var selectsesi = res.data.selectsesi;
                    var datasesi = res.data.sesi;
                    res1.render('kesimpulanassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        jawaban: jawaban,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        datakesimpulan: datakesimpulan,
                        biodata: biodata,
                        selectsesi,
                        datasesi
                    })
                    req.session.idpesertainput = null;
                    req.session.idsesiinput = null
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe, tipekonsultasi,
                    }
                    res1.redirect("/kesimpulanassessmentkarir");
                    req.session.idpesertainput = null;
                    req.session.idsesiinput = null
                })
            } else if(req.session.idsesiinput != null) {
                /** redirect after delete kesimpulan */
                /** konsultasi karir */
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectsesi: req.session.idsesiinput,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkarirsesi';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var datapeserta = res.data.cekkesimpulan;
                var selectsesi = res.data.selectsesi;
                var datasesi = res.data.sesi;
                res1.render('kesimpulanassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    datapeserta,
                    selectsesi,
                    datasesi
                })
                req.session.idsesiinput = null;
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res1.redirect("/kesimpulanassessmentkarir");
                req.session.idsesiinput = null;
            })
            } else {
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkarir';
                var dataputs = await axios.get(url)
                .then(function (res) {
                    var datasesi = res.data.sesi;
                    res1.render('kesimpulanassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        datasesi
                    })
                })
                .catch(function (err) {
                    // console.log(err.response.data)
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message,
                        idu, username, nama, tipe, tipekonsultasi,
                    }
                    res1.redirect("/");
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

Router.post('/kesimpulanassessmentkarirsesi', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        const { selectsesi } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectsesi ){
            params = {
                selectsesi: selectsesi,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulanassessmentkarirsesi';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var datapeserta = res.data.cekkesimpulan;
                var selectsesi = res.data.selectsesi;
                var datasesi = res.data.sesi;
                res1.render('kesimpulanassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    datapeserta,
                    selectsesi,
                    datasesi
                })
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res1.redirect("/kesimpulanassessmentkarir");
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Peserta Terlebih Dahulu!',
                idu, username, nama, tipe, tipekonsultasi,
            }
            res.redirect("/kesimpulanassessmentkarir");
        }
    } else {
        res.redirect('/login');
    }
});

Router.post('/kesimpulanassessmentkarir', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        const { selectpeserta, selectsesi } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectpeserta && selectsesi ){
            params = {
                selectpeserta: selectpeserta,
                selectsesi: selectsesi
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/kesimpulanassessmentkarirpeserta';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var jawaban = res.data.results;
                var datakesimpulan = res.data.datakesimpulan;
                var datapeserta = res.data.peserta;
                var selectpeserta = res.data.selectpeserta;
                var biodata = res.data.biodata;
                var selectsesi = res.data.selectsesi;
                var datasesi = res.data.sesi;
                res1.render('kesimpulanassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    jawaban: jawaban,
                    datapeserta: datapeserta,
                    selectpeserta: selectpeserta,
                    datakesimpulan: datakesimpulan,
                    biodata: biodata,
                    selectsesi,
                    datasesi
                })
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res1.redirect("/kesimpulanassessmentkarir");
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Pilih Peserta Terlebih Dahulu!',
                idu, username, nama, tipe, tipekonsultasi,
            }
            res.redirect("/kesimpulanassessmentkarir");
        }
    } else {
        res.redirect('/login');
    }
});

/** Route untuk peserta melihat kesimpulannya  */
Router.get('/lihatkesimpulankarirpeserta', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if(tipe === 'peserta' || tipe === 'peserta_event'){
            params = {
                selectpeserta: idu,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/lihatkesimpulankarirpeserta';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var rating = res.data.rating;
                
                if(rating == "true"){
                    var kesimpulan = res.data.cek_kesimpulan;
                    res1.render('lihatkesimpulankarirpeserta', {
                        idu, username, nama, tipe, tipekonsultasi, rating, kesimpulan
                    })
                } else if(rating == "false") {
                    var jawaban = res.data.results;
                    var datakesimpulan = res.data.datakesimpulan;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    var biodata = res.data.biodata;
                    res1.render('lihatkesimpulankarirpeserta', {
                        idu, username, nama, tipe, tipekonsultasi, rating,
                        jawaban: jawaban,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        datakesimpulan: datakesimpulan,
                        biodata: biodata
                    })
                }
            })
            .catch(function (err) {
                // console.log(err.response.data)
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message,
                    idu, username, nama, tipe, tipekonsultasi,
                }
                res1.redirect("/");
            })
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
})

/** start of sapa konsep */
/** Skoring konsultasi kepribadian */
Router.get('/skoringkepribadian', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            /** get data part skoring */
            let res1 = res;
            url =  process.env.MAIN_URL + '/skoringpart';
            dataputs = await axios.get(url)
            .then(function (res) {
                var part = res.data.getpart;
                /** render page skorassessment */
                res1.render('skorassessment', {
                    username, nama, idu, tipe, tipekonsultasi,
                    datapart: part
                })
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/skoringkepribadian");
            })
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
})

Router.post('/skoringkepribadian', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            const { selectpart } = req.body;
            if(selectpart){
                /** proses ke api get data skoring dari part terpilih */
                params = {
                    selectpart: selectpart,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/skorassessment2';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var selectpart = res.data.selectpart;
                    var datapart = res.data.getpart;
                    var part = res.data.part;
                    res1.render('skorassessment', {
                        idu, username, nama, tipe, tipekonsultasi,
                        selectpart, datapart, part
                    })
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/skoringkepribadian");
                })
            } else {
                /** field id acara kosong */
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field tidak boleh kosong'
                }
                res.redirect("/skoringkepribadian");
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
})

/** hasil assessment kepribadian*/
Router.get('/hasilassessmentkepribadian', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            params = {
                selectkonsul: 3,
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/hasilassessmentkepribadian';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var data = res.data.resultcekpeserta;
                var selectkonsul = res.data.selectkonsul;
                var selectpeserta = res.data.selectpeserta;
                var datakonsul = res.data.datakonsul;
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                res1.render('hasilassessmentkepribadian2', {
                    idu, username, nama, tipe, tipekonsultasi,
                    data: data,
                    selectkonsul,
                    datakonsul,
                    selectpeserta
                })
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/");
            })
        } else {
            /** di redirect ke login dengan status unauthorized */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Un-Authorized'
            }
            res.redirect("/login");
        }
    } else {
        /** di redirect ke login */
        res.redirect("/login");
    }
})

/** Route for hasil assessment kepribadian peserta*/
Router.post('/hasilassessmentkepribadian', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan'){
            const { selectpeserta } = req.body;
            if( selectpeserta ){
                if(selectpeserta == "-- Pilih Peserta --"){
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Harap pilih peserta terlebih dahulu!'
                    }
                    res.redirect("/hasilassessmentkepribadian");
                } else {
                    /** get data acara berdasarkan id yang di pilih */
                    params = {
                        selectpeserta: selectpeserta
                    }
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/hasilassessmentkepribadianpeserta';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var part1 = res.data.part1;
                        var part2 = res.data.part2;
                        var part3 = res.data.part3;
                        var part4 = res.data.part4;
                        var part5 = res.data.part5;
                        var selectpeserta = res.data.selectpeserta;
                        var data = res.data.resultcekpeserta;
                        var biodatapeserta = res.data.biodatapeserta;
                        var message = res.data.message;
                        req.session.sessionFlash2 = {
                            type: 'success',
                            message: message
                        }
                        res1.render('hasilassessmentkepribadian2', {
                            idu, username, nama, tipe, tipekonsultasi,
                            part1, part2, part3, part4, part5, 
                            data: data,
                            selectpeserta,
                            biodatapeserta
                        })
                    })
                    .catch(function (err) {
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message
                        }
                        res1.redirect("/hasilassessmentkepribadian");
                    })
                }
            } else {
                /** field id peserta kosong */
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field tidak boleh kosong'
                }
                res.redirect("/hasilassessmentkepribadian");
            }

        } else {
            /** di redirect ke login dengan status unauthorized */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Un-Authorized'
            }
            res.redirect("/login");
        }
    } else {
        /** di redirect ke login */
        res.redirect("/login");
    }
})

/** Route for kesimpulan assessment kepribadian peserta*/
Router.get('/kesimpulanassessmentkepribadian', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe == 'admin' || tipe == 'psikologis' || tipe === 'konsultan'){
            if(req.session.idpesertainput != null){
                params = {
                    selectpeserta: req.session.idpesertainput
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkepribadianpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var part1 = res.data.part1;
                    var part2 = res.data.part2;
                    var part3 = res.data.part3;
                    var part4 = res.data.part4;
                    var part5 = res.data.part5;
                    var selectpeserta = res.data.selectpeserta;
                    var data = res.data.resultcekpeserta;
                    var biodatapeserta = res.data.datapeserta;
                    var datakesimpulan = res.data.datakesimpulan;
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.render('kesimpulanassessmentkepribadian2', {
                        idu, username, nama, tipe, tipekonsultasi,
                        part1, part2, part3, part4, part5, 
                        data: data,
                        selectpeserta,
                        biodatapeserta,
                        datakesimpulan
                    })
                    req.session.idpesertainput = null
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    req.session.idpesertainput = null
                    res1.redirect("/");
                    
                })
            } else {
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkepribadian';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var data = res.data.resultcekpeserta;
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.render('kesimpulanassessmentkepribadian2', {
                        idu, username, nama, tipe, tipekonsultasi,
                        data: data,
                    })
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/");
                })
            }
        } else {
            /** di redirect ke login dengan status unauthorized */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Un-Authorized'
            }
            res.redirect("/login");
        }
    } else {
        /** di redirect ke login */
        res.redirect("/login");
    }
})

/** Route for kesimpulan assessment kepribadian peserta*/
Router.post('/kesimpulanassessmentkepribadian', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 3
        if(tipe == 'admin' || tipe == 'psikologis' || tipe === 'konsultan'){
            const { selectpeserta } = req.body;
            if( selectpeserta ){
                if(selectpeserta == "-- Pilih Peserta --"){
                    req.session.sessionFlash = {
                        type: 'error',
                        message: 'Harap pilih peserta terlebih dahulu!'
                    }
                    res.redirect("/kesimpulanassessmentkepribadian");
                } else {
                    /** get data acara berdasarkan id yang di pilih */
                    params = {
                        selectpeserta: selectpeserta
                    }
                    let res1 = res;
                    url =  process.env.MAIN_URL + '/kesimpulanassessmentkepribadianpeserta';
                    var dataputs = await axios.post(url, params)
                    .then(function (res) {
                        var part1 = res.data.part1;
                        var part2 = res.data.part2;
                        var part3 = res.data.part3;
                        var part4 = res.data.part4;
                        var part5 = res.data.part5;
                        var selectpeserta = res.data.selectpeserta;
                        var data = res.data.resultcekpeserta;
                        var biodatapeserta = res.data.datapeserta;
                        var datakesimpulan = res.data.datakesimpulan;
                        var message = res.data.message;
                        req.session.sessionFlash2 = {
                            type: 'success',
                            message: message
                        }
                        res1.render('kesimpulanassessmentkepribadian2', {
                            idu, username, nama, tipe, tipekonsultasi,
                            part1, part2, part3, part4, part5, 
                            data: data,
                            selectpeserta,
                            biodatapeserta,
                            datakesimpulan
                        })
                    })
                    .catch(function (err) {
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message
                        }
                        res1.redirect("/kesimpulanassessmentkepribadian");
                    })
                }
            } else {
                /** field id acara kosong */
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field tidak boleh kosong'
                }
                res.redirect("/kesimpulanassessmentkepribadian");
            }
        } else {
            /** di redirect ke login dengan status unauthorized */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Un-Authorized'
            }
            res.redirect("/login");
        }
    } else {
        /** di redirect ke login */
        res.redirect("/login");
    }
})
/** end of sapa konsep */

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

/** route for video call */
Router.get('/videocall', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        email = req.session.email
        if(tipe === 'admin'){
            let res1 = res;
            url =  process.env.MAIN_URL + '/videocall';
            axios.get(url)
            .then(function (res) {
                var listvidcall = res.data.listvidcall;
                var listpsikolog = res.data.listpsikolog;
                // req.session.sessionFlash2 = {
                //     type: 'success',
                //     message: message
                // }
                res1.render('videocall',{
                    idu, username, nama, tipe, email, 
                    listvidcall, listpsikolog
                });
            })
            .catch(function (err) {
                var message = err.response.data;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                console.log(message)
                res1.redirect("/");
            })
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
})

// Router.get('/listroomvcall', (req, res) => {
//     const Headers = {
//         'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
//         'Content-Type': 'application/json'
//       }
//     let res1 = res;
//     url = process.env.DAILY_URL;
//     axios.get(url, {headers: Headers})
//     .then(function (res) {
//         var data = res.data.data;
//         console.log(data);
//     })
//     .catch(function (err) {
//     // console.log(err);
//     //var message = err.response.data.message;
//     var message1 = err.response.data.error;
//     var message2 = err.response.data.info;
//     console.log(message1);
//     console.log(message2);
//     })
// })

// Router.get('/deleteroomvcall', (req, res) => {
//     //const { selectroom } = req.body;
//     const namaroom = 'testing';
//     const Headers = {
//         'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
//         'Content-Type': 'application/json'
//       }
//     let res1 = res;
//     url = process.env.DAILY_URL + '/' + namaroom;
//     axios.delete(url, {headers: Headers})
//     .then(function (res) {
//         var name = res.data.name;
//         var deleted = res.data.deleted;
//         console.log(name);
//         console.log(deleted);
//     })
//     .catch(function (err) {
//     // console.log(err);
//     //var message = err.response.data.message;
//     var message1 = err.response.data.error;
//     var message2 = err.response.data.info;
//     console.log(message1);
//     console.log(message2);
//     })
// })

// Router.post('/creatroomvcall', (req, res) => {
//     const { namaroom } = req.body; 
//     const Headers = {
//         'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
//         'Content-Type': 'application/json'
//       }
//       let data = {
//         "name": namaroom,
//         "properties" : {"eject_after_elapsed":1200}
//       }
//     let res1 = res;
//     url = process.env.DAILY_URL;
//     axios.post(url, data, {headers: Headers})
//     .then(function (res) {
//         var url = res.data.url;
//         console.log(url);
//     })
//     .catch(function (err) {
//     // console.log(err);
//     //var message = err.response.data.message;
//     var message1 = err.response.data.error;
//     var message2 = err.response.data.info;
//     console.log(message1);
//     console.log(message2);
//     })
// })

Router.get('/vidcall/:id', (req, res) => {
    if(req.session.loggedIn){

        // const { idperserta } = req.body;
        const idpeserta = req.params.id;

        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan' ){
            if(idpeserta) {
                /** cek total url psikolog yang aktif */
                params = {
                    psikolog: idu, 
                }
                let res1 = res;
                url2 = process.env.MAIN_URL + '/cekroom';
                axios.post(url2, params)
                .then(function (res) {
                    const jumlahUrl = res.data.jumlahUrl;
                    
                    /** kondisi pengecekkan jika room tersedia hapus terlebih dahulu, */
                    /** jika tidak tersedia langsung create room */
                    if(jumlahUrl === 0){
                        /** url masih kosong langsung create url*/
                        /** create room daily.co */
                        const Headers = {
                            'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
                            'Content-Type': 'application/json'
                        }
                        let data = {
                            // "name": nama,
                            // "properties" : {"eject_after_elapsed":1200, "exp":1200, "eject_at_room_exp":}
                            "properties" : 
                            {
                                "max_participants":2, 
                                "enable_chat":true
                            }
                        }
                        /** send data to API daily */
                        let res2 = res;
                        url = process.env.DAILY_URL;
                        axios.post(url, data, {headers: Headers})
                        .then(function (res) {
                            /** send data to API icare */
                            const urlroom = res.data.url;
                            const nama = res.data.name;
                            const psikolog = idu;
                            const idpeserta = req.params.id;

                            if( nama && psikolog && urlroom){
                                params = {
                                    namaroom: nama,
                                    urlroom: urlroom, 
                                    psikolog: psikolog, 
                                    peserta: idpeserta
                                }
                                let res2 = res;
                                url2 = process.env.MAIN_URL + '/room/registerroom';
                                axios.post(url2, params)
                                .then(function (res) {
                                    /** proses kirim email ke peserta dengan mengambil data url terlebih dahulu */
                                    /** 1.get data peserta (terutama email) */
                                    /** 2.get konfigurasi kirim email */
                                    /** 3.kirim email link video call daily.co */
                                    /** 4.render page test.hbs untuk video caall psikolog atau admin */
                                    const idpsikolog = idu
                                    params = {
                                        idpeserta: idpeserta,
                                        idpsikolog: idpsikolog
                                    }
                                    let res2 = res;
                                    url = process.env.MAIN_URL + '/getpesertavidcall';
                                    // url =  MAIN_URL + '/userlist';
                                    axios.post(url, params)
                                    .then(function (res) {
                                        const peserta = res.data.cek_peserta;
                                        const idpeserta = res.data.cek_peserta[0].id;
                                        const emailpeserta = res.data.cek_peserta[0].email;
                                        const urlroom = res.data.urlroom[0].url_room;
                                        var urlroom2 = res.data.real_urlroom;

                                        res1.render('test3', {
                                            idu, username, nama, tipe,
                                            urlroom2
                                        })
                                        /** sent email ke peserta */
                                        let mailOptions = {
                                            from: 'icareprodigies@gmail.com',
                                            // to: 'qurhanul.rizqie@gmail.com',
                                            to: emailpeserta, //'arieazland@gmail.com, qurhanul.rizqie@gmail.com, pacu89@gmail.com',
                                            subject: 'icare Video Call',
                                            html: `<p>Hi, berikut link yang bisa kalian akses untuk video call dengan psikolog kami: <a href="${urlroom}">Mulai Konsultasi</a> </p>`
                                        };
                                        
                                        transporter.sendMail(mailOptions, function(err, data) {
                                            if (err) {
                                                console.log("Error " + err);
                                                // req.session.sessionFlash = {
                                                //     type: 'error',
                                                //     message: err,
                                                //     idu, username, nama, tipe,
                                                // }
                                                // res1.redirect("/");
                                            } else {
                                                console.log("Email sent successfully");
                                            }
                                        });
                                        /** end sent email ke peserta */
                                    })
                                    .catch(function (err) {
                                        // var message = err.response.data.message;
                                        // req.session.sessionFlash = {
                                        //     type: 'error',
                                        //     message: message,
                                        //     idu, username, nama, tipe,
                                        // }
                                        // res1.redirect("/");
                                        if(err.response){
                                            var message = err.response.data.message;
                                            req.session.sessionFlash = {
                                                type: 'error',
                                                message: message,
                                                idu, username, nama, tipe
                                            } 
                                            res1.redirect('/');
                                        } else if(err.request){
                                            var message = err.request;
                                            req.session.sessionFlash = {
                                                type: 'error',
                                                message: message,
                                                idu, username, nama, tipe
                                            }
                                            res1.redirect('/');
                                        } else {
                                            var message = err.message;
                                            req.session.sessionFlash = {
                                                type: 'error',
                                                message: message,
                                                idu, username, nama, tipe
                                            }
                                            res1.redirect('/');
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
                                        res1.redirect('/');
                                    } else if(err.request){
                                        var message = err.request;
                                        req.session.sessionFlash = {
                                            type: 'error',
                                            message: message,
                                            idu, username, nama, tipe
                                        }
                                        res1.redirect('/');
                                    } else {
                                        var message = err.message;
                                        req.session.sessionFlash = {
                                            type: 'error',
                                            message: message,
                                            idu, username, nama, tipe
                                        }
                                        res1.redirect('/');
                                    }
                                })
                            } else {
                                req.session.sessionFlash = {
                                    type: 'error',
                                    message: 'Field tidak boleh kosong'
                                }
                                res1.redirect("/");
                            }
                        })
                        .catch(function (err) {
                            if(err.response){
                                var message = err.response.data.message;
                                req.session.sessionFlash = {
                                    type: 'error',
                                    message: message,
                                    idu, username, nama, tipe
                                } 
                                res1.redirect('/');
                            } else if(err.request){
                                var message = err.request;
                                req.session.sessionFlash = {
                                    type: 'error',
                                    message: message,
                                    idu, username, nama, tipe
                                }
                                res1.redirect('/');
                            } else {
                                var message = err.message;
                                req.session.sessionFlash = {
                                    type: 'error',
                                    message: message,
                                    idu, username, nama, tipe
                                }
                                res1.redirect('/');
                            }
                        })

                    } else if(jumlahUrl === 1){
                        /** ada url tersedia, hapus terlebih dahulu kemudian create*/
                        const idpsikolog = idu;
                        const dataroomTersedia = res.data.cek_room;
                        const dataroomTersedia_id = res.data.cek_room[0].id;
                        const dataroomTersedia_namaroom = res.data.cek_room[0].nama_room;
                        /** delete room */
                        if(dataroomTersedia_id && dataroomTersedia_namaroom){
                            const Headers = {
                                'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
                                'Content-Type': 'application/json'
                              }
                            let res2 = res;
                            /** send data to API daily */
                            url = process.env.DAILY_URL + '/' + dataroomTersedia_namaroom;
                            axios.delete(url, {headers: Headers})
                            .then(function (res) {
                                //const deleted = res.data.deleted;
                                /** send data to API icare */
                                //if(deleted === "true"){
                                    params = {
                                        id: dataroomTersedia_id,
                                    }
                                    let res2 = res;
                                    url2 = process.env.MAIN_URL + '/room/deleteroom';
                                    axios.put(url2, params)
                                    .then(function (res) {
                                        /** create room daily */
                                        const Headers = {
                                            'Authorization': 'Bearer ' + process.env.DAILY_TOKEN,
                                            'Content-Type': 'application/json'
                                        }
                                        let data = {
                                            // "name": nama,
                                            // "properties" : {"eject_after_elapsed":1200, "exp":1200, "eject_at_room_exp":}
                                            "properties" : 
                                            {
                                                "max_participants":2,
                                                "enable_chat":true
                                            }
                                        }
                                        /** send data to API daily */
                                        let res2 = res;
                                        url = process.env.DAILY_URL;
                                        axios.post(url, data, {headers: Headers})
                                        .then(function (res) {
                                            /** send data to API icare */
                                            const urlroom = res.data.url;
                                            const nama = res.data.name;
                                            const peserta = req.params.id;
                                            const psikolog = idu;

                                            if( nama && psikolog && urlroom && peserta){
                                                params = {
                                                    namaroom: nama,
                                                    urlroom: urlroom, 
                                                    peserta: peserta,
                                                    psikolog: psikolog, 
                                                }
                                                let res2 = res;
                                                url2 = process.env.MAIN_URL + '/room/registerroom';
                                                axios.post(url2, params)
                                                .then(function (res) {
                                                    /** proses kirim email ke peserta dengan mengambil data url terlebih dahulu */
                                                    /** 1.get data peserta (terutama email) */
                                                    /** 2.get konfigurasi kirim email */
                                                    /** 3.kirim email link video call daily.co */
                                                    /** 4.render page test.hbs untuk video caall psikolog atau admin */
                                                    const idpsikolog = idu;
                                                    const idpeserta = req.params.id;

                                                    console.log(idpsikolog)
                                                    console.log(idpeserta)

                                                    params = {
                                                        idpeserta: idpeserta,
                                                        idpsikolog: idpsikolog
                                                    }
                                                    let res2 = res;
                                                    url = process.env.MAIN_URL + '/getpesertavidcall';
                                                    // url =  MAIN_URL + '/userlist';
                                                    axios.post(url, params)
                                                    .then(function (res) {
                                                        const peserta = res.data.cek_peserta;
                                                        const idpeserta = res.data.cek_peserta[0].id;
                                                        const emailpeserta = res.data.cek_peserta[0].email;
                                                        const urlroom = res.data.urlroom[0].url_room;
                                                        var urlroom2 = res.data.real_urlroom;

                                                        res1.render('test3', {
                                                            idu, username, nama, tipe,
                                                            urlroom2
                                                        })
                                                        /** sent email ke peserta */
                                                        let mailOptions = {
                                                            from: 'icareprodigies@gmail.com',
                                                            // to: 'qurhanul.rizqie@gmail.com',
                                                            to: emailpeserta, //'arieazland@gmail.com, qurhanul.rizqie@gmail.com, pacu89@gmail.com',
                                                            subject: 'icare Video Call',
                                                            html: `<p>Hi, berikut link yang bisa kalian akses untuk video call dengan psikolog kami: <a href="${urlroom}">Mulai Konsultasi</a> </p>`
                                                        };
                                                        
                                                        transporter.sendMail(mailOptions, function(err, data) {
                                                            if (err) {
                                                                console.log("Error " + err);
                                                                // req.session.sessionFlash = {
                                                                //     type: 'error',
                                                                //     message: err,
                                                                //     idu, username, nama, tipe,
                                                                // }
                                                                // res1.redirect("/");
                                                            } else {
                                                                console.log("Email sent successfully");
                                                            }
                                                        });
                                                        /** end sent email ke peserta */
                                                    })
                                                    .catch(function (err) {
                                                        // var message = err.response.data.message;
                                                        // req.session.sessionFlash = {
                                                        //     type: 'error',
                                                        //     message: message,
                                                        //     idu, username, nama, tipe,
                                                        // }
                                                        // res1.redirect("/");
                                                        if(err.response){
                                                            var message = err.response.data.message;
                                                            req.session.sessionFlash = {
                                                                type: 'error',
                                                                message: message,
                                                                idu, username, nama, tipe
                                                            } 
                                                            res1.redirect('/');
                                                        } else if(err.request){
                                                            var message = err.request;
                                                            req.session.sessionFlash = {
                                                                type: 'error',
                                                                message: message,
                                                                idu, username, nama, tipe
                                                            }
                                                            res1.redirect('/');
                                                        } else {
                                                            var message = err.message;
                                                            req.session.sessionFlash = {
                                                                type: 'error',
                                                                message: message,
                                                                idu, username, nama, tipe
                                                            }
                                                            res1.redirect('/');
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
                                                        res1.redirect('/');
                                                    } else if(err.request){
                                                        var message = err.request;
                                                        req.session.sessionFlash = {
                                                            type: 'error',
                                                            message: message,
                                                            idu, username, nama, tipe
                                                        }
                                                        res1.redirect('/');
                                                    } else {
                                                        var message = err.message;
                                                        req.session.sessionFlash = {
                                                            type: 'error',
                                                            message: message,
                                                            idu, username, nama, tipe
                                                        }
                                                        res1.redirect('/');
                                                    }
                                                })
                                            } else {
                                                req.session.sessionFlash = {
                                                    type: 'error',
                                                    message: 'Field tidak boleh kosong'
                                                }
                                                res1.redirect("/");
                                            }
                                        })
                                        .catch(function (err) {
                                            if(err.response){
                                                var message = err.response.data.message;
                                                req.session.sessionFlash = {
                                                    type: 'error',
                                                    message: message,
                                                    idu, username, nama, tipe
                                                } 
                                                res1.redirect('/');
                                            } else if(err.request){
                                                var message = err.request;
                                                req.session.sessionFlash = {
                                                    type: 'error',
                                                    message: message,
                                                    idu, username, nama, tipe
                                                }
                                                res1.redirect('/');
                                            } else {
                                                var message = err.message;
                                                req.session.sessionFlash = {
                                                    type: 'error',
                                                    message: message,
                                                    idu, username, nama, tipe
                                                }
                                                res1.redirect('/');
                                            }
                                        })


                                    })
                                    .catch(function (err) {
                                        var message = err.response.data.message;
                                        req.session.sessionFlash = {
                                            type: 'error',
                                            message: message
                                        }
                                        res1.redirect("/");
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
                                res1.redirect("/");
                            })
                        } else {
                            req.session.sessionFlash = {
                                type: 'error',
                                message: "Buat room psikolog gagal",
                                idu, username, nama, tipe,
                            }
                            res1.redirect("/");
                        }
                    } else {
                        req.session.sessionFlash = {
                            type: 'error',
                            message: "Buat room psikolog gagal",
                            idu, username, nama, tipe,
                        }
                        res1.redirect("/");
                    }
                })
                .catch(function (err) {
                    if(err.response){
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        } 
                        res1.redirect('/');
                    } else if(err.request){
                        var message = err.request;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/');
                    } else {
                        var message = err.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/');
                    }
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field Tidak Boleh Kosong!'
                }
                res.redirect('/');
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
})

/** test for vidcall */
Router.get('/videocallicare/:url/:url2', (req, res) => {
    var urlvideocall = req.params.url;
    var urlvideocall2 = req.params.url2;
    res.render("test2",{
        urlvideocall, urlvideocall2
    })
})

/** route for rating psikolog */
Router.get('/ratingpsikolog', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        email = req.session.email
        if(tipe === 'psikologis'){
            params = {
                psikolog: idu
            }
            let res1 = res;
            url =  process.env.MAIN_URL + '/ratingpsikolog';
            axios.post(url, params)
            .then(function (res) {
                var all = res.data.allRating;
                var count = res.data.countRating;
                var rataratarating = res.data.ratarataRating[0].rata2;
                // req.session.sessionFlash2 = {
                //     type: 'success',
                //     message: message
                // }
                res1.render('ratingpsikolog',{
                    idu, username, nama, tipe, email, 
                    all, count, rataratarating
                });
            })
            .catch(function (err) {
                var message = err.response.data;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                console.log(message)
                res1.redirect("/");
            })
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
})

/** Route for list peserta */
Router.get('/listpeserta', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        email = req.session.email
        if(tipe === 'admin'){
            res.render('listpeserta',{
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
})

/** Route for list peserta */
Router.post('/listpeserta', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        email = req.session.email
        if(tipe === 'admin'){
            const { selectkategorilist } = req.body

            if(selectkategorilist){
                params = {
                    kategorilist: selectkategorilist
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/kategorilist';
                axios.post(url, params)
                .then(function (res) {
                    var data = res.data.data;
                    var kategorilist = res.data.kategorilist;
                    var judul = res.data.judul;
                    // req.session.sessionFlash2 = {
                    //     type: 'success',
                    //     message: message
                    // }
                    res1.render('listpeserta',{
                        idu, username, nama, tipe, email, 
                        data, kategorilist, judul
                    });
                })
                .catch(function (err) {
                    if(err.response){
                        var message = err.response.data.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        } 
                        res1.redirect('/listpeserta');
                    } else if(err.request){
                        var message = err.request;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/listpeserta');
                    } else {
                        var message = err.message;
                        req.session.sessionFlash = {
                            type: 'error',
                            message: message,
                            idu, username, nama, tipe
                        }
                        res1.redirect('/listpeserta');
                    }
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Harap pilih kategori list terlebih dahulu'
                }
                res.redirect('/listpeserta');
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
})

/** Route for lupa password */
Router.post('/lupapassword', async (req, res) => {
    const { emailfrgtpass } = req.body;

    if(emailfrgtpass){
        /** get data user berdasarkan email yang di input */
        params = {
            email: emailfrgtpass,
        }
        let res1 = res;
        url =  process.env.MAIN_URL + '/lupapassword';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            email = res.data.results[0].email;
            peserta = res.data.results[0].id;
            /** sent email ke peserta */
            let mailOptions = {
                from: 'arieazland23@gmail.com',
                to: email,
                subject: 'icare reset Password',
                html: '<p>Hi, untuk mereset password anda, silahkan klik <a href="'+process.env.URL+'/resetpassword/'+peserta+'">disni</a> </p>'
            };
            
            transporter.sendMail(mailOptions, function(err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log("Email sent successfully");
                }
            });
            /** end sent email ke peserta */
            req.session.sessionFlash2 = {
                type: 'success',
                message: 'Jika email yang digunakan terdaftar, silahkan cek inbox atau spam pada email anda dan ikuti instruksinya'
            }
            res1.redirect("/login");
        })
        .catch(function (err) {
            console.log(err.response)
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/login");
        })
    } else {
        /** Field kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Email tidak boleh kosong'
        }
        res.redirect("/login");
    }
})

/** Route for reset password */
Router.get('/resetpassword/:id', async (req, res) => {
    var idpeserta = req.params.id;

    if(idpeserta){
        res.render('resetpass', {
            idpeserta
        })
    } else {
        /** Field kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'id tidak boleh kosong'
        }
        res.redirect("/login");
    }
})

/** Route for log activity */
Router.get('/logactivity', async (req, res) => {
    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin'){
            res.render('log', {
                idu, username, nama, tipe
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe
            }
            res.redirect('/login');  
        }
    } else {
        res.redirect('/login');
    }
})

Router.post('/logactivity', async (req, res) => {
    const { datestart, dateend } = req.body;

    if(req.session.loggedIn){
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        if(tipe === 'admin'){
            if(datestart && dateend){
                params = {
                    datestart: datestart,
                    dateend: dateend
                }
                let res1 = res;
                url = process.env.MAIN_URL + '/logactivity';
                axios.post(url, params)
                .then(function (res) {
                    var data = res.data.data_log;
                    var count = res.data.data_count;
                    var data_datestart = res.data.datestart;
                    var data_dateend = res.data.dateend;
                    res1.render('log', {
                        idu, username, nama, tipe,
                        data, count, data_datestart, data_dateend
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
                    res1.redirect("/");
                })
            } else {
                /** Field kosong */
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Field tidak boleh kosong'
                }
                res.redirect("/login");
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized',
                idu, username, nama, tipe
            }
            res.redirect('/login');  
        }
    } else {
        res.redirect('/login');
    }
})

/** Router for logout */
Router.get('/logout', (req, res) =>{
    idu = req.session.iduser
    /** start of get user activity */
    var source = req.headers['user-agent'],
    ua = useragent.parse(source);
    namabrowser = ua.browser;
    namaos = ua.os;
    namaplatform = ua.platform;
    /** end of get user activity */

    params = {
        idu: idu,
        namabrowser: namabrowser,
        namaos: namaos,
        namaplatform: namaplatform
    }
    let res1 = res;
    url =  process.env.MAIN_URL + '/logout';
    axios.post(url, params)
    .then(function (res) {
        req.session.destroy((err) => {
            res1.redirect("/login");
        })
    })
    .catch(function (err) {
        var message = err.response.data.message;
        req.session.sessionFlash = {
            type: 'error',
            message: message
        }
        console.log(message)
        res1.redirect("/");
    })
})

module.exports = Router;