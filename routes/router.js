const express = require("express");
const router = express.Router();
const model = require("../models/model");
const LoginController = require("../controllers/loginController");
const SignInController = require("../controllers/signInController");
const userFormController = require("../controllers/userFormController");
// const mainPageController = require("../controllers/mainPageController");



// defino api endpoints y le indico que funcion del controlador usar


// hacer rutas para 
router.post("/login", LoginController.login);
router.post("/signIn", SignInController.signIn);
router.get("/signIn", (req, res) => res.render("signIn"));
// router.post("/recommendations", mainPageController.ponerFuncion aca);

router.post("/userForm", (req, res, next) => {
    console.log("POST /userForm recibido");
    next();

}, userFormController.userForms);
router.get("/userForm", (req, res) => {
    console.log("query:", req.query);
    const actors = model.obtenerTodosLosActores();
    const movies = model.obtenerTodasLasPeliculas();
    const user   = model.encontrarUsuarioPorEmail(req.query.email);
    console.log("user:", user);
    res.render("userForm", { user, actors, movies });
});
router.get("/mainPage", (req, res) => res.render("mainPage"));

module.exports = router;
