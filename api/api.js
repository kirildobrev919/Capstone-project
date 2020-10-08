const express = require('express');
const apiRouter = express.Router();
const apiArtist = require('./artist.js');
const apiSeries = require('./series.js');

apiRouter.use('/artists', apiArtist);
apiRouter.use('/series', apiSeries);
module.exports = apiRouter;