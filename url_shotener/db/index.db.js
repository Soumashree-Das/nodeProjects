// // const mongoose = require('mongoose');
// import mongoose from 'mongoose';
// export async function connectDB(url){
//     return mongoose.connect(url);
// }


import mongoose from 'mongoose';
import { configDotenv } from "dotenv";
configDotenv();
// configdotenv();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;