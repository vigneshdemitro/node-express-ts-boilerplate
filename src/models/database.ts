import { configDotenv } from "dotenv";
import logger from "../utils/logger";
import mongoose from "mongoose";
configDotenv();

const uri = process.env.DB_CONNECTION_STRING || '';

export const connectToDatabase = async () => {
    try {
        const client = mongoose.connect(uri, { connectTimeoutMS: 50000 });
        client.then((res) => logger.info(`Connection successful and connected to db: ${res.connection.name}`));
    } catch (error) {
        console.error('Error in connecting to DB: ', error);
        await disconnectFromDatabase();
    }
}

export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        logger.debug('Disconnected from DB');
        process.exit(0);
    } catch (error) {
        logger.error('Error in disconnecting DB: ', error);
        process.exit(1);
    }
};

