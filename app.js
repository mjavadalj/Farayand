const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi');
const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express()
const moment = require('moment-jalaali')
const quiz=require('./routes/quiz')
const session=require('./routes/session')
const lesson=require('./routes/lesson')
const course=require('./routes/course')
const university=require('./routes/university')
const teacher=require('./routes/teacher')
const eCourse=require('./routes/eCourse')
const eLesson=require('./routes/eLesson')
const eSession=require('./routes/eSession')
const eQuestion=require('./routes/eQuestion')
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/quiz',quiz)
app.use('/session',session)
app.use('/lesson',lesson)
app.use('/course',course)
app.use('/university',university)
app.use('/teacher',teacher)
app.use('/embed/course',eCourse)
app.use('/embed/course/lesson',eLesson)
app.use('/embed/course/lesson/session',eSession)
app.use('/embed/course/lesson/session/question',eQuestion)
const db_name='basij_asatid'
let x = `mongodb://localhost:27017/${db_name}`
// let y='mongodb+srv://cesium:cesium@cluster0-jexk6.mongodb.net/test?retryWrites=true'
mongoose.connect((x),{ useFindAndModify: false }, (err) => {
    if (!err) {
        console.log(`Connented to ${db_name}...`);
    }
    else {
        console.log(err);
    }
})
module.exports = app
