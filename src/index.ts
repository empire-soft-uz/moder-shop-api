import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";
import ImageKit from "imagekit";

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO;

async function startServer() {
  try {
    await mongoose.connect(mongoURL);
    console.log("Db connected");
    app.listen(port, () => {
      console.log(`Listening on Port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
