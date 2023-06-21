import express from "express";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";

import "express-async-errors";
import BadRequestError from "./Classes/Errors/BadRequestError";
import NotFoundError from "./Classes/Errors/NotFoundError";
import validateUser from "./middlewares/validateUser";
import productRouter from "./routes/productRoute";
import vendorRoute from "./routes/vendorRoute";
import reviewRouter from "./routes/reviewRoute";
import orderRoute from "./routes/orderRoute";

const app = express();
app.use(express.json());
app.get("/", validateUser, async (req, res, next) => {
  res.send("protected route");
});
app.use("/api/users", userRoute);
app.use("/api/products", productRouter);
app.use("/api/vendors", vendorRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRoute);
app.all("*", (req, res, next) => {
  throw new NotFoundError("Not Found");
});
app.use(errorHandler);
export default app;
