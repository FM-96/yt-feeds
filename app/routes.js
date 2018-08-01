const express = require('express');

const playlistsRouter = require('./playlists/playlists.router.js');

const router = express.Router();

router.use('/playlists', playlistsRouter);

module.exports = router;
