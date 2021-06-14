const Express = require("express");
const Router = Express.Router();
const soalController = require("../controllers/soal");

/** Router */
Router.post('/input', soalController.input);
Router.post('/edit', soalController.edit);
Router.post('/delete', soalController.delete);

module.exports = Router;