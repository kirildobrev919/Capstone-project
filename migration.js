const sqlite3 = require('sqlite3');
const db = sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('DROP TABLE IF EXIST Artist', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Table Artist droped!');
    })
    db.run('CREATE TABLE IF NOT EXIST Artist (id INTEGER PRIMARY KEY REQIRED, name TEXT REQIRED, date_of_birth TEXT REQIRED, biography TEXT REQUIRED, is_currently_employed INTEGER DEFAULT 1)', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Table artist created!');
    })
})

