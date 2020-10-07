const express = require('express');
const apiRouter = express.Router();
const apiArtist = require('./artist.js');

apiRouter.use('/artists', apiArtist);
module.exports = apiRouter;