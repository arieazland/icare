const Express = require("express");
const Router = Express.Router();
const kesimpulanController = require("../controllers/kesimpulan");

/** Router */
Router.post('/input', kesimpulanController.input);
Router.post('/edit', kesimpulanController.edit);
Router.post('/delete', kesimpulanController.delete);
module.exports = Router;