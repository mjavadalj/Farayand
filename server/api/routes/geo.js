const express = require("express");
const router = express.Router();
const geoController = require('../controllers/geo');

//show all
router.get('/showall', geoController.showAll)
//show all provinces
router.get('/province/showall', geoController.showAllProvinces)
//show all cities
router.post('/city/showall', geoController.showAllCitiesOfProvince)
//Add new country
router.post('/country/add', geoController.addCountry);
//Add new province
router.post('/province/add', geoController.addProvince);
//delete province
router.patch('/province/delete', geoController.deleteProvince);
//edit province
router.patch('/province/edit', geoController.editProvince);
//Add new city
router.post('/city/add', geoController.addCity);
//delete city
router.patch('/city/delete', geoController.deleteCity);
//edit city
router.patch('/city/edit', geoController.editCity);
//delete all
router.delete('/deleteall', geoController.deleteAll);
module.exports = router;