let express = require("express");
let router = express.Router();
var controller = require("./mainScreen.controller");
router.get("", controller.mainScreen);
module.exports = router;
