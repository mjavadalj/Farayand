const express = require("express");
const router = express.Router();
const sessionController = require('../controllers/session')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, __dirname + '../../../files')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${req.body.sessionId}.${file.originalname}`)
    }

})

const fileFilter = (req, file, callBack) => {

    if (file.mimetype === 'video/mp4' ||
        file.mimetype === 'application/zip' ||
        file.mimetype === 'application/pdf'
    ) {
        callBack(null, true)
    }

    else {
        callBack(new Error('not supported'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter
});

//show all sessions
router.post("/showall",sessionController.showAllSessions);

//show all questions
router.post("/showallquestions", sessionController.showAllQuestions);
//show randonm questions
router.post("/showrandonmquestions", sessionController.showRandomQuestions);
//add session
router.patch("/add", sessionController.addASession);
//edit a session
router.patch("/edit", sessionController.editASession);
//delete a session
router.patch("/delete", sessionController.deleteSingleSession);
//delete all sessions
router.patch("/deleteall", sessionController.deleteAllSessons);

router.post("/addFile", upload.single('file'), sessionController.addFile);


module.exports = router;
