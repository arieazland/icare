const Express = require("express");
const Router = Express.Router();
const jawabController = require("../controllers/jawab");

/** Router */
Router.post('/part1', jawabController.partSatu);
Router.post('/part2', jawabController.partDua);
Router.post('/part3', jawabController.partTiga);
Router.post('/input', jawabController.input);
Router.post('/edit', jawabController.edit);
Router.post('/delete', jawabController.delete);

module.exports = Router;