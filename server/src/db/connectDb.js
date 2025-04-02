import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/vintage`);
    console.log(`MongoDb connection successful: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to Mongodb: ", error);
    process.exit(1);
  }
};

export default connectDb;
