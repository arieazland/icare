const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

exports.partSatu = async (req, res, dataputs) => {
    const { iduser, idpart, idsoal, radio1, radio2, radio3, radio4, essayboxg , essayboxi, selectsesi} = req.body;

    if(iduser && idpart && idsoal && radio1 && radio2 && radio3 && radio4 && selectsesi){
        params = {
            iduser: iduser,
            idpart: idpart,
            idsoal: idsoal,
            radio1: radio1,
            radio2: radio2,
            radio3: radio3,
            radio4: radio4,
            essayboxg: essayboxg,
            essayboxi: essayboxi,
            selectsesi: selectsesi
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/jawab/registerjawab1';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            var message = res.data.message;
            var selectsesi = res.data.selectsesi;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message,
                selectsesi
            }
            
            res1.redirect('/assessmentuserkarir');
        })
        .catch(function (err) {
            /** get message from API */
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/assessmentuserkarir");
        })
    } else {
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/assessmentuserkarir");
    }
}

exports.partDua = async (req, res, dataputs) => {
    const {iduser, idpart, idsoal, radio5, radio6, radio7, radio8, radiosub5, essayboxi, selectsesi } = req.body;

    if(iduser && idpart && idsoal && radio5 && radio6 && radio7 && radio8 && selectsesi){
        params = {
            iduser: iduser,
            idpart: idpart,
            idsoal: idsoal,
            radio5: radio5,
            radio6: radio6,
            radio7: radio7,
            radio8: radio8,
            radiosub5: radiosub5,
            essayboxi: essayboxi,
            selectsesi: selectsesi
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/jawab/registerjawab2';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            var message = res.data.message;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            var users = res.data;
            res1.redirect('/assessmentuserkarir');
        })
        .catch(function (err) {
            /** get message from API */
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/assessmentuserkarir");
        })
    } else {
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/assessmentuserkarir");
    }
}

exports.partTiga = async (req, res, dataputs) => {
    const { iduser, idpart, idsoal, radio9, radio10, essayboxi, selectsesi } = req.body;

    if(iduser && idpart && idsoal && radio9 && radio10 && selectsesi){
        params = {
            iduser: iduser,
            idpart: idpart,
            idsoal: idsoal,
            radio9: radio9,
            radio10: radio10,
            essayboxi: essayboxi,
            selectsesi: selectsesi
        }
        var res1 = res;
        url =  process.env.MAIN_URL + '/jawab/registerjawab3';
        var dataputs = await axios.post(url, params)
        .then(function (res) {
            var message = res.data.message;
            req.session.sessionFlash2 = {
                type: 'success',
                message: message
            }
            res1.redirect('/assessmentuserkarir');
        })
        .catch(function (err) {
            /** get message from API */
            var message = err.response.data.message;
            req.session.sessionFlash = {
                type: 'error',
                message: message
            }
            res1.redirect("/assessmentuserkarir");
        })
    } else {
        /** Field tidak boleh kosong */
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/assessmentuserkarir");
    }
}

exports.input = async (req, res, dataputs) => {
    // try{
    //     const { jawaban, pertanyaan, peserta, selectkonsul } = req.body;

    //     if(jawaban && pertanyaan && peserta && selectkonsul){
    //         params = {
    //             jawaban: jawaban,
    //             idpertanyaan: pertanyaan,
    //             iduser: peserta,
    //             idkonsul: selectkonsul
    //         }
    //         var res1 = res;
    //         url =  process.env.MAIN_URL + '/jawab/registerjawab';
    //         var dataputs = await axios.post(url, params)
    //         .then(function (res) {
    //             req.session.idkonsulinput = res.data.idkonsul;
    //             var message = res.data.message;
    //             req.session.sessionFlash2 = {
    //                 type: 'success',
    //                 message: message
    //             }
    //             var users = res.data;
    //             res1.redirect('/assessmentuserkarir');
    //         })
    //         .catch(function (err) {
    //             var message = err.response.data.message;
    //             req.session.sessionFlash = {
    //                 type: 'error',
    //                 message: message
    //             }
    //             res1.redirect("/assessmentuserkarir");
    //         })
    //     } else{
    //         /** Field tidak boleh kosong */
    //         req.session.sessionFlash = {
    //             type: 'error',
    //             message: 'Field tidak boleh kosong!'
    //         }
    //         res.redirect("/assessmentuserkarir");
    //     }
    // } catch(error){
    //     // console.log(err);
    //     /** catch */
    //     req.session.sessionFlash = {
    //         type: 'error',
    //         message: error
    //     }
    //     res.redirect("/assessmentuserkarir");
    // }
};

exports.edit = async (req, res, dataputs) => {
    
};

exports.delete = async (req, res, dataputs) => {
    
};