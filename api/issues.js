const express = require('express');
const apiSeries = require('./series');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite3');
const apiIssues = express.Router({ mergeParams: true });

module.exports = apiIssues;