require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const requireDir = require('require-dir');
const cors = require('cors')
//App start
const app = express();
var corsOptions = {
  origin: 'https://application-tcc.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use();
app.use(express.json());
app.use(bodyParser.json());
//DB start
mongoose.connect(process.env.URL_MONGO, { useUnifiedTopology: true, useNewUrlParser: true })
requireDir('./src/models/');

app.use('/api', require('./src/routes'));

app.listen(process.env.PORT||3001);
