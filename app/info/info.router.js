const express = require('express');

const infoController = require('./info.controller.js');

const router = express.Router();

router.get('/', infoController.handle);

module.exports = router;
