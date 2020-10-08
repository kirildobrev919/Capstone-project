const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Artist', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Table Artist droped!');
        }
    })
    db.run('CREATE TABLE IF NOT EXISTS Artist (' +
        'id INTEGER PRIMARY KEY NOT NULL,' +
        ' name TEXT NOT NULL,' +
        ' date_of_birth TEXT NOT NULL,' +
        ' biography TEXT NOT NULL,' +
        ' is_currently_employed INTEGER DEFAULT 1)', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Table artist created!');
            }

        }
    )
})

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Series', (error) => {
        if (error) {
            console.log(err);
        } else {
            console.log('Table Series Dropped!');
        }
    });

    db.run('CREATE TABLE IF NOT EXISTS Series ' +
        '(id INTEGER PRIMARY KEY NOT NULL,' +
        'name TEXT NOT NULL,' +
        'description TEXT NOT NULL)', (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Table Series has been created!');
            }
        }
    )
})
