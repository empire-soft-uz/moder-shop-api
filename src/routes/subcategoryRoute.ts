import { Router, Request, Response } from "express";
import "express-async-errors";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import { subcatCreation } from "../Validation/SubcatRules";
import Validator from "../utils/Valiadtor";
import Subcategory from "../Models/Subcateygory";
import Category from "../Models/Category";
import BadRequestError from "../Classes/Errors/BadRequestError";

const subcatRoute = Router();
subcatRoute.post(
  "/new",
  [...subcatCreation],
  isSuperAdmin,
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { name, props, category } = req.body;
    const parentCat = await Category.findById(category);
    if (!parentCat) throw new BadRequestError("Invalid category is provided");
    const subCt = Subcategory.build(req.body);
    await subCt.save();
    parentCat.subcategories.push(subCt.id);
    await parentCat.save();
    res.send(subCt);
  }
);
export default subcatRoute;
