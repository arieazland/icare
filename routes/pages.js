const Express = require("express");
const axios = require('axios');
const Router = Express.Router();
const Moment = require("moment");
const nodemailer = require('nodemailer');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
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
                res1.render('assessmentuserkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    datapart: datapart
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
                        var datapart = res.data.datapart;
                        var selectpart = res.data.selectpart;
                        res1.render('assessmentuserkarir', {
                            idu, username, nama, tipe, tipekonsultasi,
                            datasoal: datasoal,
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
                var peserta = res.data.results;
                res1.render('hasilassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    datapeserta: peserta,
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
        const { selectpeserta } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectpeserta){
                params = {
                    selectpeserta: selectpeserta,
                }
                let res1 = res;
                url =  process.env.MAIN_URL + '/hasilassessmentkarirpeserta';
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var jawaban = res.data.results;
                    var datapeserta = res.data.peserta;
                    var selectpeserta = res.data.selectpeserta;
                    var biodata = res.data.biodata;
                    res1.render('hasilassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        jawaban: jawaban,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        biodata: biodata
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
            if(req.session.idpesertainput != null){
                /** konsultasi karir */
                /** get data konsul berdasarkan id yang di pilih */
                params = {
                    selectpeserta: req.session.idpesertainput,
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
                    res1.render('kesimpulanassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        jawaban: jawaban,
                        datapeserta: datapeserta,
                        selectpeserta: selectpeserta,
                        datakesimpulan: datakesimpulan,
                        biodata: biodata
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
                let res1 = res;
                url =  process.env.MAIN_URL + '/kesimpulanassessmentkarir';
                var dataputs = await axios.get(url)
                .then(function (res) {
                    var peserta = res.data.cekkesimpulan;
                    res1.render('kesimpulanassessmentkarir', {
                        idu, username, nama, tipe, tipekonsultasi,
                        datapeserta: peserta,
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

Router.post('/kesimpulanassessmentkarir', async (req, res, dataputs) => {
    if(req.session.loggedIn){
        const { selectpeserta } = req.body;
        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        tipekonsultasi = 1
        if( selectpeserta){
            params = {
                selectpeserta: selectpeserta,
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
                res1.render('kesimpulanassessmentkarir', {
                    idu, username, nama, tipe, tipekonsultasi,
                    jawaban: jawaban,
                    datapeserta: datapeserta,
                    selectpeserta: selectpeserta,
                    datakesimpulan: datakesimpulan,
                    biodata: biodata
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

/** test for vidcall */
Router.get('/videocallicare/:url/:url2', (req, res) => {
    var urlvideocall = req.params.url;
    var urlvideocall2 = req.params.url2;
    res.render("test2",{
        urlvideocall, urlvideocall2
    })
})

Router.get('/vidcall/:id', (req, res) => {
    if(req.session.loggedIn){

        // const { idperserta } = req.body;
        var idpeserta = req.params.id;

        idu = req.session.iduser
        username = req.session.username
        nama = req.session.nama
        tipe = req.session.type
        /** vidcall = "true" **/
        if(tipe === 'admin' || tipe === 'psikologis' || tipe === 'konsultan' ){
            if(idpeserta) {
                /** 1.get data peserta (terutama email) */
                /** 2.get konfigurasi kirim email */
                /** 3.kirim email link video call daily.co */
                /** 4.render page test.hbs untuk video caall psikolog atau admin */
                /**res.render("test",{
                    username, nama, idu, tipe, vidcall
                })**/
                params = {
                    idpeserta: idpeserta,
                }
                let res1 = res;
                url = process.env.MAIN_URL + '/getpeserta';
                // url =  MAIN_URL + '/userlist';
                axios.post(url, params)
                .then(function (res) {
                    var peserta = res.data;
                    res1.render('test', {
                        idu, username, nama, tipe,
                        peserta: peserta
                    })
                    /** sent email ke peserta */
                    let mailOptions = {
                        from: 'arieazlandfirly@gmail.com',
                        // to: 'qurhanul.rizqie@gmail.com',
                        to: 'arieazland@gmail.com, qurhanul.rizqie@gmail.com, pacu89@gmail.com',
                        subject: 'i-care Video Call Link',
                        // text: 'Hi, berikut link yang bisa kalian akses untuk video call dengan psikolog kami: https://qiera.daily.co/new-prebuilt-test '
                        text: 'Hi, berikut link yang bisa kalian akses untuk video call dengan psikolog kami: https://care.imeet.id/videocallicare/qiera.daily.co/new-prebuilt-test '
                    };
                    
                    transporter.sendMail(mailOptions, function(err, data) {
                        if (err) {
                            console.log("Error " + err);
                        } else {
                            console.log("Email sent successfully");
                        }
                    });
                    /** end sent email ke peserta */
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
                /** redirect ke page kesimpulan dengan membawa data tipe konsultasi dan peserta terpilih */
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Not Authorized'
            }
            res.redirect('/login');
        }
    } else {
        // req.session.sessionFlash = {
        //     type: 'error',
        //     message: 'Silahkan login terlebih dahulu!'
        // }
        res.redirect('/login');
    }
})
/** end test */

/** Router for logout */
Router.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

module.exports = Router;