import express from "express";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";

import "express-async-errors";

const app = express();
app.get("/", async (req, res) => {
  throw new Error("async error");
  res.send("test message");
});
app.use("/api/users", userRoute);

app.all("*", (req, res, next) => {
  res.status(404).send("Route Not Found");
});
app.use(errorHandler);
export default app;
