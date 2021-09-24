const Express = require("express");
const Router = Express.Router();
const kesimpulankepribadianController = require("../controllers/kesimpulankepribadian");

/** Router */
Router.post('/input', kesimpulankepribadianController.input);
Router.post('/edit', kesimpulankepribadianController.edit);
Router.post('/delete', kesimpulankepribadianController.delete);
module.exports = Router;