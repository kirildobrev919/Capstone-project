const express = require('express');
const apiArtist = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

apiArtist.param('artistId', (req, res, next, artistId) => {
    db.get(`SELECT * FROM Artist WHERE id == ${artistId}`, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.artist = row;
            next();
        } else {
            res.sendStatus(404);
        }
    })
    // const sql = 'SELECT * FROM Artist WHERE id = $artistId';
    // const values = { $artistId: artistId };
    // db.get(sql, values, (error, artist) => {
    //     if (error) {
    //         next(error);
    //     } else if (artist) {
    //         req.artist = artist;
    //         next();
    //     } else {
    //         res.sendStatus(404);
    //     }
    // })
});

apiArtist.get('/', (req, res, next) => {
    db.all('SELECT * FROM Artist WHERE is_currently_employed = 1', (err, artists) => {
        if (err) {
            console.log(err);
            //passing err to middleware errorhandler
            next(err);
        } else {
            //res sends json object with  artists
            res.status(200).json({ artists: artists });
        }
    })
})

apiArtist.get('/:artistId', (req, res, next) => {
    let selectedArtist = req.artist
    res.json({ artist: selectedArtist });
})

module.exports = apiArtist;