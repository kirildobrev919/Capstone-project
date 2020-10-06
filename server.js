const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());

// morgan to log depending on the environment
if (app.get('env') != 'production') {
    app.use(morgan('tiny'));
}

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
})

module.exports = app;
