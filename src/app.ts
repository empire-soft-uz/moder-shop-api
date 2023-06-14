import express from "express";
import userRoute from "./routes/userRoute";
const app = express();

app.use("/api/users", userRoute);

export default app;
