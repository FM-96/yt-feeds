const Feed = require('feed');

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

	let allPlaylistItems = [];
	let playlistInfo;

	// validate format
	if (!Object.values(SUPPORTED_FORMATS).includes(format)) {
		res.status(400).send({
			error: `Unsupported format. Supported formats are: ${Object.values(SUPPORTED_FORMATS).map(e => `'${e}'`).join(', ')}`,
		});
		return;
	}

	// get data from YouTube
	let nextPageToken;
	try {
		const playlistRes = await youtube.playlists.list({
			part: 'id,snippet',
			id: playlistId,
		});
		playlistInfo = playlistRes.data.items[0];
		if (!playlistInfo) {
			throw new Error('Playlist not found');
		}
		do {
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
			error: err.message,
		});
		return;
	}

	if (req.query.show_unavailable === undefined) {
		allPlaylistItems = allPlaylistItems.filter(e => !(e.snippet.title === 'Private video' && e.snippet.description === 'This video is private.'));
	}

	// sort playlist items (most recently added to playlist first)
	allPlaylistItems.sort((a, b) => {
		if (a.snippet.publishedAt > b.snippet.publishedAt) {
			return -1;
		}
		if (a.snippet.publishedAt < b.snippet.publishedAt) {
			return 1;
		}
		return 0;
	});

	const feed = new Feed({
		title: playlistInfo.snippet.title,
		link: `https://www.youtube.com/playlist?list=${playlistInfo.id}`,
		description: playlistInfo.snippet.description,
		updated: allPlaylistItems.length > 0 ? new Date(allPlaylistItems[0].snippet.publishedAt) : new Date(playlistInfo.snippet.publishedAt),
	});

	allPlaylistItems.forEach(e => feed.addItem({
		title: e.snippet.title,
		link: `https://www.youtube.com/watch?v=${e.snippet.resourceId.videoId}`,
		description: e.snippet.description,
		date: new Date(e.snippet.publishedAt),
	}));

	switch (format) {
		case SUPPORTED_FORMATS.FORMAT_JSON:
			res.set('Content-Type', 'application/json').send(feed.json1());
			break;
		case SUPPORTED_FORMATS.FORMAT_RSS:
			res.set('Content-Type', 'application/rss+xml').send(feed.rss2());
			break;
		default:
			res.status(500).send({
				error: 'Something went wrong (this should never happen)',
			});
			break;
	}
}
