const instaApi = require("instagram-api.js");

const lastInstaPost = async username => {
    try {
        const userInfo = await instaApi.user(username);

        if (!userInfo) {
            console.error('Error: ', 'No instagram profile data');
            return;
        }

        const lastPosts = userInfo.edge_owner_to_timeline_media.edges;

        if (!lastPosts) {
            console.error('Error: ', 'No instagram posts data');
            return;
        }

        const lastPostId = lastPosts[0].node.shortcode;

        return `instagram.com/p/${lastPostId}`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}


module.exports = {lastInstaPost};