const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Certificate = require("../models/certificate");
const moment = require("moment-jalaali");
const certificateController = require("../controllers/certificate");

//add a certificate
router.post("/add", certificateController.add);

//delete a certificate
router.post("/delete", certificateController.delete);

//show all certificates
router.post("/showall", certificateController.showAll);

//show a certificate
router.post("/show all", certificateController.show);

module.exports = router;
