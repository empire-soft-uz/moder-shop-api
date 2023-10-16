import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import startSocketServer from "./socketRoutes/soketRoute";
import server from "./WebServer";

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO!;
async function startServer() {
  try {
    await mongoose.connect(mongoURL!);
    console.log("Db connected");
    server.listen(port, () => {
      console.log(`Listening on Port: ${port}`);
      startSocketServer();
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
