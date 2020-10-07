const express = require('express');
const apiArtist = express.Router();
const sqlite3 = require('sqlite3');
const db = sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


module.exports = apiArtist;