import { Router, Request, Response } from "express";
import "express-async-errors";
import Category from "../Models/Category";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
import Subcategory from "../Models/Subcateygory";
const categoryRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });

categoryRoute.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find().populate("subcategories");

  res.send(categories);
});
categoryRoute.put(
  "/edit/:id",
  isSuperAdmin,
  upload.single("icon"),
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) throw new NotFoundError("Category not found");
    if (!name) throw new BadRequestError("Category name is required");
    if (req.file) {
      const fns = [];
      if (category.icon) {
        fns.push(MediaManager.deletefiles(category.icon));
      }
      fns.push(MediaManager.uploadFile(req.file));
      const [icon] = await Promise.all(fns);
      category.icon = icon;
    }
    category.name = name;
    await category.save();
    res.send(category);
  }
);

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
categoryRoute.post(
  "/new/many",
  isSuperAdmin,

  async (req: Request, res: Response) => {
    const { categories } = req.body;
    const newCts = await Category.insertMany(categories);
    res.send(newCts);
  }
);
categoryRoute.get("/:id", async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id).populate(
    "subcategories"
  );
  if (!category) throw new NotFoundError("Category Not Found");
  res.send(category);
});
categoryRoute.delete(
  "/:id",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    const asyncFns = [];
    if (!category) throw new NotFoundError("Category not found");
    asyncFns.push(
      Subcategory.deleteMany({ _id: { $in: category.subcategories } })
    );
    if (category.icon) {
      asyncFns.push(MediaManager.deletefiles(category.icon));
    }

    await Promise.all(asyncFns);
    res.send(category);
  }
);

export default categoryRoute;
