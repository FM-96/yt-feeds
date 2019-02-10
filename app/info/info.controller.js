module.exports = {
	handle,
};

const version = require('../../package.json').version + (process.env.NODE_ENV === 'production' ? '' : '-dev'); // eslint-disable-line global-require

async function handle(req, res) {
	res.send({version});
}
