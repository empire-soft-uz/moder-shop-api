import express from "express";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";

import "express-async-errors";
import NotFoundError from "./Classes/Errors/NotFoundError";
import validateUser from "./middlewares/validateUser";
import productRouter from "./routes/productRoute";
import vendorRoute from "./routes/vendorRoute";
import reviewRouter from "./routes/reviewRoute";
import orderRoute from "./routes/orderRoute";
import adminRoute from "./routes/adminRoutes";
import categoryRoute from "./routes/categoryRoute";
import subcatRoute from "./routes/subcategoryRoute";
import propRoutes from "./routes/propRoutes";
import cors from "cors";
import sliderRouter from "./routes/sliderRoutes";
import path from "path";
import chatRouter from "./routes/chatRoutes";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", validateUser, async (req, res, next) => {
  res.send("protected route");
});
app.use("/api/admins", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subcatRoute);
app.use("/api/props", propRoutes);
app.use("/api/slides", sliderRouter);
app.use("/api/products", productRouter);
app.use("/api/vendors", vendorRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRoute);
app.all("*", (req, res, next) => {
  throw new NotFoundError("Not Found");
});
app.use(errorHandler);
export default app;
