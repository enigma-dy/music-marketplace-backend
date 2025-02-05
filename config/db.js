import mongoose from "mongoose";


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/music");
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
