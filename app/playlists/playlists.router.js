const express = require('express');

const playlistController = require('./playlists.controller.js');

const router = express.Router();

router.get('/:playlistId/:format', playlistController.handle);

module.exports = router;
