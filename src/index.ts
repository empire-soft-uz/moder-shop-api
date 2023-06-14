import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO || "mongodb://localhost:27017/Moder";
async function startServer() {
  try {
    await mongoose.connect(mongoURL);
    app.listen(port, () => {
      console.log(`Listening on Port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
