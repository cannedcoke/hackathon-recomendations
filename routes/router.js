const express = require("express");
const router = express.Router();
const controller = require("../controllers/loginController");
// const controller = require("../controllers/mainPage");
// const controller = require("../controllers/signInController");
// const controller = require("../controllers/userFormController");


// defino api endpoints y le indico que funcion del controlador usar


// hacer rutas para 
router.post("/login", controller.login);
// router.post("/add", controller.addRecord);
// router.post("/vote",controller.addVote)
// router.delete("/unVote",controller.removeVote)
// router.put("/update",controller.updateRecord)
// exporto para poder acceder externamente
module.exports = router;
