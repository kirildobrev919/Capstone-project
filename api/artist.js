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
});

apiArtist.get('/', (req, res, next) => {
    db.all('SELECT * FROM Artist WHERE is_currently_employed = 1', (err, artists) => {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.status(200).json({ artists: artists });
        }
    })
})

apiArtist.get('/:artistId', (req, res, next) => {
    let selectedArtist = req.artist
    res.json({ artist: selectedArtist });
})

apiArtist.post('/', (req, res, next) => {
    let artist = req.body.artist;
    let name = artist.name;
    let dateOfBirth = artist.dateOfBirth;
    let biography = artist.biography;
    let isCurrentlyEmployed = artist.isCurrentlyEmployed === 0 ? 0 : 1;

    if (!req.body.artist) {
        console.log('first if');
        res.sendStatus(400);
    }

    if (!name || !dateOfBirth || !biography || !isCurrentlyEmployed) {
        console.log('sec if');
        res.sendStatus(400);
    }

    let sql = 'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dob, $biography, $ice)';
    let values = {
        $name: name,
        $dob: dateOfBirth,
        $biography: biography,
        $ice: isCurrentlyEmployed
    }
    db.run(sql, values, function (error) {
        if (error) {
            console.log('after insert in err');
            next(err);
        }
        db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`, (err, artist) => {
            if (err) {
                return res.sendStatus(500);
            } else {
                res.status(201).json({ artist: artist });
            }
        });
    })
})

apiArtist.put('/:artistId', (req, res, next) => {
    const newArtist = req.body.artist;

    if (!newArtist.name || !newArtist.dateOfBirth || !newArtist.biography || !newArtist.isCurrentlyEmployed) {
        res.sendStatus(400);
    }

    let values = {
        $name: artist.name,
        $dob: artist.dateOfBirth,
        $biography: artist.biography,
        $ice: artist.isCurrentlyEmployed,
        $id: artist.id
    }
    let sql = `UPDATE TABLE Artist SET (name = $name, date_of_birth = $dob, biography = $biography,` +
        `is_currently_employed = $ice WHERE id = $id)`;
    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        }
        db.get(`SELECT * FROM Artist WERE id = ${this.lastID}`, (err, artist) => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.status(200).json({ artist: artist });
            }
        })
    })
})

//})

module.exports = apiArtist;