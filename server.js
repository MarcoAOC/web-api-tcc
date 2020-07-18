require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const requireDir = require('require-dir');

//App start
const app = express();
app.use(express.json());
app.use(bodyParser.json());
//DB start
mongoose.connect(process.env.URL_MONGO, { useUnifiedTopology: true, useNewUrlParser: true })
requireDir('./src/models/');

app.use('/api', require('./src/routes'));

app.listen(process.env.PORT||3001);