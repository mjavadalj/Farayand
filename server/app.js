const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
require('./api/middlewares/passportJWTConfig')(passport);
const app = express()
const router = require('./api/routes/router');
app.use(passport.initialize());
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//TODO: user access
app.use('/files', express.static(__dirname + '/files'))
app.use('/api', router);


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
