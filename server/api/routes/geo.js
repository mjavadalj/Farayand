const express = require("express");
const router = express.Router();
const geoController = require('../controllers/geo');

//Add new country
router.post('/addcountry', geoController.addCountry);
//Add new province
router.post('/addprovince', geoController.addProvince);
//Add new city
router.post('/addcity', geoController.addCity);
//delete all
router.delete('/deleteall', geoController.deleteAll);
module.exports = router;