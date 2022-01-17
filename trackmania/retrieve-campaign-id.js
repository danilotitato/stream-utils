const axios = require('axios');
const clearTMString = require('../utils/clear-tm-string.js');

const retrieveCampaignId = async campaignName => {
    try {
        const { data } = await axios.get(`https://trackmania.io/api/campaigns/0?search=${campaignName}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        if (data.campaigns.length && campaignName.toUpperCase() === clearTMString(data.campaigns[0].name).toUpperCase()) {
            return [data.campaigns[0].id, data.campaigns[0].clubid];
        }

        console.error('Error: ', 'Campaign not found');
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = retrieveCampaignId;
