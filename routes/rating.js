const Express = require("express");
const Router = Express.Router();
const ratingController = require("../controllers/rating");

/** Router */
Router.post('/regis', ratingController.Registrasi);
// Router.post('/delete', ratingController.Delete);

module.exports = Router;