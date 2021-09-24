const Express = require("express");
const Router = Express.Router();
const kesimpulankarirController = require("../controllers/kesimpulankarir");

/** Router */
Router.post('/input', kesimpulankarirController.input);
Router.post('/edit', kesimpulankarirController.edit);
Router.post('/delete', kesimpulankarirController.delete);
module.exports = Router;