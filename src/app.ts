import express from "express";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";

import "express-async-errors";
import BadRequestError from "./Classes/Errors/BadRequestError";
import NotFoundError from "./Classes/Errors/NotFoundError";

const app = express();
app.use(express.json());
app.get("/", async (req, res, next) => {
  next(new BadRequestError("async error"));
  res.send("test message");
});
app.use("/api/users", userRoute);

app.all("*", (req, res, next) => {
  throw new NotFoundError("Not Found");
});
app.use(errorHandler);
export default app;
