require('dotenv').config();
const { MongoClient } = require("mongodb");

const dbUri = process.env.MONGODB_URI;

const getRandom = async () => {
    const client = new MongoClient(dbUri, { useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('watchactions');
        const collection = database.collection('actions');

        const cursor = collection.aggregate([{ $sample: { size: 1 } }]);

        const watchAction = await cursor.next();

        return `${watchAction.verb} ${between(10, 5000)} ${watchAction.action}`;

    } catch(error) {
        console.error('Error: ', error.message);
        throw error;
    }
    finally {
        await client.close();
    }
}

const between = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

module.exports = getRandom;