const Express = require("express");
const Router = Express.Router();
const roomController = require("../controllers/room");

/** Router */
Router.post('/create', roomController.Create);
Router.post('/delete', roomController.Delete);

module.exports = Router;