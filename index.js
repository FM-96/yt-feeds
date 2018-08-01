require('dotenv').config();

const express = require('express');

const routes = require('./app/routes.js');

const app = express();

// TODO add logging

app.use(routes);
app.use(function (req, res) {
	res.sendStatus(404);
});

app.listen(process.env.PORT, () => {
	console.log(`Now listening on port ${process.env.PORT}`);
});
