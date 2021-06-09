const Express = require("express");
const Router = Express.Router();
const konsultasiController = require("../controllers/konsultasi");

/** Router */
Router.post('/input', konsultasiController.input);
Router.post('/edit', konsultasiController.edit);
Router.post('/delete', konsultasiController.delete);

module.exports = Router;