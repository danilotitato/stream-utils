const instaApi = require("instagram-api.js");

const lastInstaPost = async username => {
    try {
        const userData = await instaApi.user(username);

        if (!userData) {
            console.error('Error: ', 'No instagram profile data');
            return;
        }

        const lastPosts = userData.edge_owner_to_timeline_media.edges;

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

const instaWar = async (targetUser, rivalUser, targetAlias, rivalAlias,
        winningEmote, losingEmote) => {
    try {
        const targetUserData = await instaApi.user(targetUser);
        const rivalUserData = await instaApi.user(rivalUser);

        if (!targetUserData || !rivalUserData) {
            console.error('Error: ', 'No instagram profile data');
            return;
        }

        const targetFollowers = targetUserData.edge_followed_by.count;
        const rivalFollowers = rivalUserData.edge_followed_by.count;
        const followersDiff = rivalFollowers - targetFollowers;

        const diffMsg = followersDiff > 0
            ? ` Need ${followersDiff} followers more!`
            : followersDiff < 0
                ? ` We are ${-followersDiff} followers ahead, keep it going!`
                : ' We need just another one to pass!';
        const emote = followersDiff >= 0 ? losingEmote : winningEmote;

        return `${targetAlias} has ${targetFollowers} followers vs. ${rivalFollowers} from ${rivalAlias} on Instagram ${emote}${diffMsg} Follow me on instagram.com/${targetUser}`
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = {instaWar, lastInstaPost};