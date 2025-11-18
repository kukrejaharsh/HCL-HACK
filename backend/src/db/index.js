import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectToDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(` \n Connected to MongoDB successfully!! DB Host - ${connectionInstance.connection.host} \n `);
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}


export default connectToDatabase;