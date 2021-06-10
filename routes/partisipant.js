const Express = require("express");
const Router = Express.Router();
const partisipantController = require("../controllers/partisipant");

/** Router */
Router.post('/insert', partisipantController.input);
// Router.post('/delete', partisipantController.delete);

module.exports = Router;