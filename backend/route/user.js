const route = require("express").Router();

const functions = require("../functions/userFunction.js");

route.post("/register", functions.Register);
route.post("/login", functions.Login);
route.get("/testmail", functions.sendMail);
route.patch("/verify/:id/:password", functions.verifyEmail);
route.get("/getuserbyid/:id", functions.getUserById)
module.exports = route;
