var express = require('express');
var router = express.Router();
var controller = require("./provincePrison.controller");

router.get("/criminalPrison", controller.criminalPrison);
router.get("/criminalPrisonDetails", controller.criminalPrisonDetails);
router.get("/criminalInfo", controller.criminalInfo);
module.exports = router;
