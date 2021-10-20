const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/auth");

/** Router */
Router.post('/login', authController.login);
Router.post('/reg', authController.reg);
Router.post('/registrasipeserta', authController.regPeserta);
Router.post('/edit', authController.edit);
Router.post('/delete', authController.delete);
Router.post('/gantipassword', authController.gantiPassword);
Router.post('/resetpassword', authController.resetPassword);

module.exports = Router;