const express = require('express');
const apiSeries = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

apiSeries.param('seriesId', (req, res, next, seriesId) => {
    const sql = `SELECT * FROM Series WHERE id = $seriesId`;
    const values = { $seriesId: seriesId };

    db.get(sql, values, (error, row) => {
        if (error) {
            next(error);
        } else if (row) {
            req.series = row;
            next();
        } else {
            res.sendStatus(404);
        }
    })
})

apiSeries.all('/', (req, res, next) => {
    const sql = 'SELECT * FROM Series';
    db.all(sql, (error, series) => {
        if (error) {
            next(error);
        }
        res.status(200).json({ series: series });
    })
});

apiSeries.get('/:seriesId', (req, res, next) => {
    if (!req.series) {
        res.sendStatus(500);
    } else {
        res.status(200).json({ series: req.series });
    }
})
module.exports = apiSeries;