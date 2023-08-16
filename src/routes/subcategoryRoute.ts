import { Router, Request, Response } from "express";
import "express-async-errors";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import { subcatCreation } from "../Validation/SubcatRules";
import Validator from "../utils/Valiadtor";
import Subcategory from "../Models/Subcateygory";
import Category from "../Models/Category";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";

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
subcatRoute.post(
  "/new/many",
  // [...subcatCreation],
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const { subcategories, category } = req.body;
    const parentCat = await Category.findById(category);
    if (!parentCat) throw new BadRequestError("Invalid category is provided");
    const subcts = await Subcategory.insertMany(subcategories);
    subcts.forEach((subCt) => {
      parentCat.subcategories.push(subCt.id);
    });

    await parentCat.save();
    res.send({ category: parentCat, subcts });
  }
);
subcatRoute.get("/", async (req: Request, res: Response) => {
  const subCts = await Subcategory.find();
  res.send(subCts);
});
subcatRoute.get("/:id", async (req: Request, res: Response) => {
  //
  const subcategory = await Subcategory.findById(req.params.id).populate({
    path: "props",
    model: "PropValue",
    populate: { path: "prop", model: "Prop" },
  });
  let temp = {};
  subcategory?.props.map((p, i) => {
    if (temp[p.prop.name]) {
      temp[p.prop.name] = [...temp[p.prop.name], p];
    } else {
      temp[p.prop.name] = [p];
    }
  });
  //console.log(temp);
  res.send(
    subcategory
      ? { id: subcategory.id, name: subcategory.name, props: temp }
      : {}
  );
});
subcatRoute.put("/:id", isSuperAdmin, async (req: Request, res: Response) => {
  const { name, removedProps, newProps } = req.body;

  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) throw new NotFoundError("Subcategory Not Found");
  if (name) {
    subcategory.name = name;
  }
  let tempProps: string[] = [];
  if (removedProps && removedProps.length > 0) {
    tempProps = subcategory.props.filter((p) => {
      if (!removedProps.find((r: string) => r === p)) {
        return p;
      }
    });
  }
  if (newProps && newProps.length > 0) {
    tempProps.push(...newProps);
  }
  const uniqueProps = new Set(tempProps);
  subcategory.props = Array.from(uniqueProps);
  await subcategory.save();
  res.send(subcategory);
});

export default subcatRoute;
