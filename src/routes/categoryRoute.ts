import { Router, Request, Response } from "express";
import "express-async-errors";
import Category from "../Models/Category";
import validateAdmin from "../middlewares/validateAdmin";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";
const categoryRoute = Router();
categoryRoute.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.send(categories);
});
categoryRoute.post(
  "/new",
  validateAdmin,
  async (req: Request, res: Response) => {
    const { name } = req.body;
    console.log(req.body);
    if (!name) throw new BadRequestError("Category name is required");
    const category = Category.build({ name });
    await category.save();
    res.send(category);
  }
);
categoryRoute.delete(
  "/category/:id",
  validateAdmin,
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new NotFoundError("Category not found");
    res.send(category);
  }
);

export default categoryRoute;
