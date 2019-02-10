const express = require('express');

const infoRouter = require('./info/info.router.js');
const playlistsRouter = require('./playlists/playlists.router.js');

const router = express.Router();

router.use('/info', infoRouter);
router.use('/playlists', playlistsRouter);

module.exports = router;
