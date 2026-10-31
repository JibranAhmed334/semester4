import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  const DB_NAME = "EventSphere";

  try {
    const conn = await mongoose.connect(process.env.MONGO_ALTAS_URI, { dbName: DB_NAME });
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Connected database: ${conn.connection.name}`);
  } catch (error) {
    console.log(`Error in connection: `, error.message);
    throw error;
  }
};

export default connectDb;