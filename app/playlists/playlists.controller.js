module.exports = {
	handle,
};

function handle(req, res) {
	// TODO
	const {playlistId, format} = req.params;
	res.send({
		playlistId,
		format,
	});
}
