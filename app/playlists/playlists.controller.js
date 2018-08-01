const youtube = require('../../youtube.js');

module.exports = {
	handle,
};

async function handle(req, res) {
	const {playlistId, format} = req.params;

	const allPlaylistItems = [];

	let nextPageToken;

	// TODO validate playlistId and format

	try {
		let requestCount = 1; // XXX
		do {
			console.log(`request ${requestCount++}`); // XXX
			const ytRes = await youtube.playlistItems.list({
				part: 'id,snippet',
				playlistId,
				maxResults: 50,
				pageToken: nextPageToken,
			});
			allPlaylistItems.push(...ytRes.data.items);
			nextPageToken = ytRes.data.nextPageToken;
		} while (nextPageToken);
	} catch (err) {
		res.status(500).send({
			success: false,
			error: err.message,
		});
		return;
	}

	res.send({
		success: true,
		playlistId,
		format,
		allPlaylistItems,
	});
}
