import { Router } from "express";
const userRoute = Router();

userRoute.post("/register", async (req, res) => {
  res.send("register route");
});

export default userRoute;
