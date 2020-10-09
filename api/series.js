const express = require('express');
const apiSeries = express.Router();
const sqlite3 = require('sqlite3');
const apiIssues = require('./issues.js');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

apiSeries.param('seriesId', (req, res, next, seriesId) => {
    const sql = `SELECT * FROM Series WHERE id = $seriesId`;
    const values = { $seriesId: seriesId };

    db.get(sql, values, (error, series) => {
        if (error) {
            next(error);
        } else if (series) {
            req.series = series;
            next();
        } else {
            res.sendStatus(404);
        }
    })
})

apiSeries.use('/:seriesId/issues', apiIssues);

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
    const name = req.body.series.name,
        description = req.body.series.description;
    if (!name || !description) {
        return res.sendStatus(400);
    }

    const sql = 'INSERT INTO Series (name, description) VALUES ($name, $description)';
    const values = {
        $name: name,
        $description: description
    };

    db.run(sql, values, function (error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Series WHERE Series.id = 1`,
                (error, series) => {
                    if (error) {
                        return res.sendStatus(500);
                    }
                    res.sendStatus(201).json({ series: series });
                }
            );
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

apiSeries.delete('/:seriesId', (req, res, next) => {
    const issueSql = 'SELECT * FROM Issue WHERE series_id = $seriesId';
    const issueValues = { $seriesId: req.params.seriesId };

    db.all(issueSql, issueValues, (error, issues) => {
        if (error) {
            next(error);
        } else {
            if (issues.length != 0) {
                res.sendStatus(400)
            }
            const sql = 'DELETE FROM Series WHERE Series.id = $sereisId';
            const values = { $seriesId: req.params.seriesId };

            db.run(sql, values, (error) => {
                if (error) {
                    next(error);
                }
                res.sendStatus(204);
            });
        }
    });
});

module.exports = apiSeries;