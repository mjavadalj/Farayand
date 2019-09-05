const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan');

const passport = require('passport');
const app = express()
const embed = require('./api/routes/embed')
const router = require('./api/routes/router');
app.use(passport.initialize());
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router);

app.use('/embed', embed);


const db_name = 'basij_asatid'
let x = `mongodb://localhost:27017/${db_name}`
// let y='mongodb+srv://cesium:cesium@cluster0-jexk6.mongodb.net/test?retryWrites=true'
mongoose.connect((x), { useFindAndModify: false }, (err) => {
    if (!err) {
        console.log(`Connented to ${db_name}...`);
    }
    else {
        console.log(err);
    }
})
module.exports = app
