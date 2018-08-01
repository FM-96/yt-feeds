const youtube = require('../../youtube.js');

module.exports = {
	handle,
};

const SUPPORTED_FORMATS = {
	FORMAT_JSON: 'json',
	FORMAT_RSS: 'rss',
};

async function handle(req, res) {
	const {playlistId, format} = req.params;

	const allPlaylistItems = [];

	let nextPageToken;

	// validate format
	if (!Object.values(SUPPORTED_FORMATS).includes(format)) {
		res.status(400).send({
			success: false,
			error: `Unsupported format. Supported formats are: ${Object.values(SUPPORTED_FORMATS).map(e => `'${e}'`).join(', ')}`,
		});
		return;
	}

	// TODO validate playlistId

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

	// sort playlist items (newest in playlist first)
	allPlaylistItems.sort((a, b) => {
		if (a.snippet.publishedAt > b.snippet.publishedAt) {
			return -1;
		}
		if (a.snippet.publishedAt < b.snippet.publishedAt) {
			return 1;
		}
		return 0;
	});

	switch (format) {
		case SUPPORTED_FORMATS.FORMAT_JSON:
			res.send({
				success: true,
				playlistId,
				format,
				allPlaylistItems,
			});
			break;
		case SUPPORTED_FORMATS.FORMAT_RSS:
			res.status(500).send({
				success: false,
				error: 'Not implemented yet',
			});
			break;
	}
}
