const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/loginController");
const SignInController = require("../controllers/signInController");



// defino api endpoints y le indico que funcion del controlador usar


// hacer rutas para 
router.post("/login", LoginController.login);
router.post("/signIn", SignInController.signIn);

router.get("/userForm", (req, res) => res.render("userForm"));
router.get("/mainPage", (req, res) => res.render("mainPage"));

module.exports = router;
