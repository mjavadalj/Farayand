const express = require("express");
const router = express.Router();
const universityController = require('../controllers/university');


//Add new university
router.post('/add', universityController.addUniversity);

//Show all universites
router.get('/showall', universityController.showAllUniversites);

//Show a university
router.get('/show/:id', universityController.showSingleUniversity);

//Delete all universites
router.delete('/deleteall', universityController.deleteAllUniversites);

//Delete a university
router.post('/delete', universityController.deleteSingleUniversity);

//Edit a university
router.patch('/edit', universityController.editAUniversity);

module.exports = router;