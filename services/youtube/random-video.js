const axios = require('axios');
const ytch = require('yt-channel-info');
const getRandomElement = require('../../utils/random-element.js');

const randomVideo = async channel => {
    try {
        const firstPayload = {
            channelId: channel,
            channelIdType: 3
         }

        const firstResponse = await ytch.getChannelVideos(firstPayload);
        const videoList = [];

        if (!firstResponse.alertMessage) {
            videoList.push(...firstResponse.items);

            let continuation = firstResponse.continuation;

            while (continuation) {
                const nextPayload = {
                    continuation: continuation
                }

                const nextResponse = await ytch.getChannelVideosMore(nextPayload);

                videoList.push(...nextResponse.items);

                continuation = nextResponse.continuation;
            }

            const randomVideoItem = getRandomElement(videoList.slice(1)); // Skip last video
            const randomVideoTitle = randomVideoItem.title;
            const randomVideoId = randomVideoItem.videoId;

            return `${randomVideoTitle} - https://youtu.be/${randomVideoId}`;
         } else {
            console.error('Channel could not be found.');
            throw firstResponse.alertMessage;
         }
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = randomVideo;
