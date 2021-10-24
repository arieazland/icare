const Mysql = require("mysql");
const Path = require("path");
const axios = require('axios');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });
// process.env.MAIN_URL

/** Login Process */
exports.login = async (req, res, dataputs) => {
    try {
        const { email, password } = req.body;
        /** start of get user activity */
        var source = req.headers['user-agent'],
        ua = useragent.parse(source);
        namabrowser = ua.browser;
        namaos = ua.os;
        namaplatform = ua.platform;
        /** end of get user activity */


        if(email && password){
            params = {
                email: email,
                password: password,
                namabrowser: namabrowser,
                namaos: namaos,
                namaplatform: namaplatform
              }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/login';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                // var message = res.data.message;
                // console.log(message)
                req.session.loggedIn = true;
                req.session.userdata = res.data.data;
                req.session.iduser = res.data.data[0].id;
                req.session.nama = res.data.data[0].nama;
                req.session.email = res.data.data[0].email;
                req.session.username = res.data.data[0].username;
                req.session.type = res.data.data[0].account_type;
                var users = res.data;
                res1.redirect('/');
            })
            .catch(function (err) {
                /** get message from API */
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/login");
                
            })
        } else {
            /** username dan password kosong */
            req.session.sessionFlash = {
                type: 'error',
                message: 'Email atau password tidak boleh kosong!'
            }
            res.redirect("/login");
        }
    } catch (error) {
        // console.log(error);
        /** catch */
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/login");
    }        
};

exports.regPeserta = async (req, res, dataputs) => {
    const { username, nama, email, password, password2, jenis_kelamin, nomor_kontak, tempat_lahir, tanggal_lahir, pendidikan, universitas, jurusan } = req.body;

    if(username && nama && email && password && password2 && jenis_kelamin && nomor_kontak && tempat_lahir && tanggal_lahir && pendidikan && universitas && jurusan){
        if(password == password2) {
            params = {
                username: username,
                nama: nama,
                email: email,
                password: password,
                password2: password2,
                jenis_kelamin: jenis_kelamin,
                nomor_kontak: nomor_kontak,
                tempat_lahir: tempat_lahir,
                tanggal_lahir: tanggal_lahir,
                pendidikan: pendidikan,
                universitas: universitas,
                jurusan: jurusan
            }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/registerpeserta';
            var dataputs = await axios.post(url, params)
            .then(function (res) {
                var message = res.data.message;
                req.session.sessionFlash2 = {
                    type: 'success',
                    message: message
                }
                var users = res.data;
                res1.redirect('/login');
            })
            .catch(function (err) {
                var message = err.response.data.message;
                req.session.sessionFlash = {
                    type: 'error',
                    message: message
                }
                res1.redirect("/register");
            })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Mohon di cek kembali password dan konfirmasi password anda tidak sama'
            }
            res.redirect("/register");
        }
    } else {
        req.session.sessionFlash = {
            type: 'error',
            message: 'Field tidak boleh kosong!'
        }
        res.redirect("/register");
    }
}

exports.reg = async (req, res, dataputs) => {
    try{
        const { nama, email, password, password2, tipeakun } = req.body;

        if(nama && email && password && password2 && tipeakun != '0'){
            if(password == password2){
                params = {
                    nama: nama,
                    email: email,
                    password: password,
                    password2: password2,
                }
                var res1 = res;
                url = process.env.MAIN_URL + '/auth/register' + tipeakun;
                var dataputs = await axios.post(url, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    var users = res.data;
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })
            } else {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Password dan konfirmasi password tidak sama'
                }
                res.redirect("/users");
            }
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }
    } catch(error){
        // console.log(error);
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/users");
    }
}

/** Edit User */
exports.edit = async (req, res, dataputs) => {
    try{
        const { modalid, modalnama, modalemail } = req.body;
        if(modalid && modalemail && modalnama){
            params = {
                id: modalid,
                nama: modalnama,
                email: modalemail
            }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/edituser';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message;
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })

        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }

    } catch(error){
        // console.log(error);
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/users");
    }
}

/** Delete User */
exports.delete = async (req, res, dataputs) => {
    try{
        const { modalidhapus } = req.body;
        if(modalidhapus){
            params = {
                id: modalidhapus
            }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/deleteuser';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/users');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/users");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/users");
        }
    } catch(error){
        // console.log(error);
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/users");
    }
}

/** Ganti password User */
exports.gantiPassword = async (req, res, dataputs) => {
    try{
        const { idakun, passwordlama, password, password2 } = req.body;
        if(idakun && passwordlama && password && password2){
            params = {
                id: idakun,
                passwordlama: passwordlama,
                password: password,
                password2: password2,
            }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/gantipassword';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/accountsetting');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/accountsetting");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/accountsetting");
        }
    } catch(error){
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/accountsetting");
    }
}

/** Reset password User */
exports.resetPassword = async (req, res, dataputs) => {
    try{
        const { idakun, password, password2 } = req.body;
        if(idakun && password && password2){
            params = {
                id: idakun,
                password: password,
                password2: password2,
            }
            var res1 = res;
            url = process.env.MAIN_URL + '/auth/resetpassword';
            var dataputs = await axios.put(url, params)
                .then(function (res) {
                    var message = res.data.message
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: message
                    }
                    res1.redirect('/login');
                })
                .catch(function (err) {
                    var message = err.response.data.message;
                    req.session.sessionFlash = {
                        type: 'error',
                        message: message
                    }
                    res1.redirect("/login");
                })
        } else {
            req.session.sessionFlash = {
                type: 'error',
                message: 'Field tidak boleh kosong!'
            }
            res.redirect("/login");
        }
    } catch(error){
        req.session.sessionFlash = {
            type: 'error',
            message: error
        }
        res.redirect("/login");
    }
}