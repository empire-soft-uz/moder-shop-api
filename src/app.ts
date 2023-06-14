import express from "express";
import userRoute from "./routes/userRoute";
const app = express();
app.get("/", (req, res) => {
  res.send("test message");
});
app.use("/api/users", userRoute);

export default app;
