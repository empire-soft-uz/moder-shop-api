import { Router, Request, Response } from "express";
import "express-async-errors";
import Category from "../Models/Category";
import validateAdmin from "../middlewares/validateAdmin";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
const categoryRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });

categoryRoute.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.send(categories);
});
categoryRoute.post(
  "/new",
  validateAdmin,
  upload.single("icon"),
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) throw new BadRequestError("Category name is required");
    if (!req.file) throw new BadRequestError("Category Icon Required");
    const icon = await MediaManager.uploadFile(req.file);
    const category = Category.build({ name, icon });
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
    await MediaManager.deletefiles(category.icon);
    res.send(category);
  }
);

export default categoryRoute;
