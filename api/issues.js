const express = require('express');
const apiSeries = require('./series');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const apiIssues = express.Router({ mergeParams: true });

apiIssues.param('issueId', (req, res, next, issueId) => {
    db.get(`SELECT * FROM Issue WHERE id = ${issueId}`,
        (err, issue) => {
            if (err) {
                next(err);
            } else if (issue) {
                req.issue = issue;
                next();
            } else {
                res.sendStatus(404);
            }
        }
    );
});

apiIssues.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`, (err, issues) => {
        if (err) {
            next(err);
        }
        res.status(200).json({ issues: issues });
    });
});

apiIssues.post('/', (req, res, next) => {
    const name = req.body.issue.name,
        issueNumber = req.body.issue.issueNumber,
        publicationDate = req.body.issue.publicationDate,
        artistId = req.body.issue.artistId;

    const artistSql = 'SELECT * FROM Artist WHERE Artist.id = $artistId';
    const artistValues = { $artistId: artistId };
    db.get(artistSql, artistValues, (error, artist) => {
        if (error) {
            next(error);
        } else {
            if (!name || !issueNumber || !publicationDate || !artist) {
                return res.sendStatus(400);
            }

            const sql = 'INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id)' +
                'VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)';
            const values = {
                $name: name,
                $issueNumber: issueNumber,
                $publicationDate: publicationDate,
                $artistId: artistId,
                $seriesId: req.params.seriesId
            };

            db.run(sql, values, function (error) {
                if (error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM Issue WHERE Issue.id = ${this.lastID}`,
                        (error, issue) => {
                            res.status(201).json({ issue: issue });
                        });
                }
            });
        }
    });
});

apiIssues.put('/:issueId', (req, res, next) => {

    const name = req.body.issue.name,
        issueNumber = req.body.issue.issueNumber,
        publicationDate = req.body.issue.publicationDate,
        artistId = req.body.issue.artistId,
        issueId = req.params.issueId;

    const artistSql = 'SELECT * FROM Artist WHERE Artist.id = $artistId';
    const artistValues = { $artistId: artistId };

    db.get(artistSql, artistValues, (error, artist) => {
        if (error) {
            next(error);
        } else {
            if (!name || !issueNumber || !publicationDate || !artist) {
                return res.sendStatus(400);
            }

            const sql = 'UPDATE Issue SET name = $name, issue_number = $issueNumber, ' +
                'publication_date = $publicationDate, artist_id = $artistId ' +
                'WHERE Issue.id = $issueId';
            const values = {
                $name: name,
                $issueNumber: issueNumber,
                $publicationDate: publicationDate,
                $artistId: artistId,
                $issueId: issueId
            };

            db.run(sql, values, function (error) {
                if (error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM Issue WHERE Issue.id = ${issueId}`,
                        (error, issue) => {
                            res.status(200).json({ issue: issue });
                        }
                    )
                }
            })
        }
    })
});

apiIssues.delete('/:issueId', (req, res, next) => {
    const sql = 'DELETE FROM Issue WHERE Issue.id = $issueId';
    const values = { $issueId: req.params.issueId };
    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    })
})

module.exports = apiIssues;