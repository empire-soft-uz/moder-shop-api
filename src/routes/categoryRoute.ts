import { Router, Request, Response } from "express";
import "express-async-errors";
import Category from "../Models/Category";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
const categoryRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });

categoryRoute.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find().populate("subcategories");
  res.send(categories);
});
categoryRoute.post(
  "/new",
  isSuperAdmin,
  upload.single("icon"),
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) throw new BadRequestError("Category name is required");
    const category = Category.build({ name });
    if (req.file) {
      const icon = await MediaManager.uploadFile(req.file);
      category.icon = icon;
    }
    await category.save();
    res.send(category);
  }
);
categoryRoute.delete(
  "/category/:id",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new NotFoundError("Category not found");
    if (category.icon) {
      await MediaManager.deletefiles(category.icon);
    }
    res.send(category);
  }
);

export default categoryRoute;
