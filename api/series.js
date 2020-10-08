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

apiSeries.post('/', (req, res, next) => {

    if (!req.body.series) {
        res.sendStatus(400);
    }

    let name = req.body.series.name;
    let description = req.body.series.description;

    if (!name || !description) {
        res.sendStatus(400);
    }

    let sql = 'INSERT INTO Series (name, description) VALUES ($name, $description)';
    let values = {
        $name: name,
        $description: description,
    }
    db.run(sql, values, function (error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Series WHERE Series.id = ${this.lastID}`, (error, series) => {
                if (error) {
                    res.sendStatus(500);
                }
                res.status(201).json({ series: series });
            });
        }
    });
});

apiSeries.put('/:seriesId', (req, res, next) => {
    let newSeries = req.body.series;
    if (!newSeries) {
        res.sendStatus(400);
    }
    let name = newSeries.name;
    let description = newSeries.description;
    if (!name || !description) {
        res.sendStatus(400);
    }
    let sql = 'UPDATE Series SET name = $name, description = $description WHERE Series.id = $seriesId';
    let values = {
        $name: name,
        $description: description,
        $seriesId: req.params.seriesId
    }
    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        }
        db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`, (err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            res.status(200).json({ series: result });
        });
    });
});

const apiIssues = require('./issues.js');
apiSeries.use('/series/:seriesId/issues', apiIssues);

module.exports = apiSeries;