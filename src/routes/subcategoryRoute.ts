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
    const { name, newProps, category } = req.body;
    const parentCat = await Category.findById(category);
    if (!parentCat) throw new BadRequestError("Invalid category is provided");
    const subCt = Subcategory.build({name,props:newProps.map(p=>p.id),});
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
  const { admin } = req.query;
  const subcategory = await Subcategory.findById(req.params.id).populate({
    path: "props",
    model: "PropValue",
    populate: { path: "prop", model: "Prop" },
  });
  if (admin) {
    res.send(subcategory);
    return;
  }
  let temp = {};
  subcategory?.props.map((p, i) => {
    const name = p.prop.name.split(" ").join("_");
    if (temp[name]) {
      temp[name].props.push(p);
    } else {
      temp[name] = { id: p.prop.id, label: p.prop.label, props: [p] };
    }
  });
  res.send(
    subcategory
      ? { id: subcategory.id, name: subcategory.name, props: temp }
      : {}
  );
});
subcatRoute.put("/:id", isSuperAdmin, async (req: Request, res: Response) => {
  const { name, subctProps, newProps } = req.body;
  const temp: string[] = [];
  if (Array.isArray(subctProps)) {
    subctProps.forEach((e) => {
      temp.push(e.id);
    });
  }
  if (Array.isArray(newProps)) {
    newProps.forEach((e) => {
      temp.push(e.id);
    });
  }

  const props = [...new Set(temp)];
  
   const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, {name, props});
   if (!subcategory) throw new NotFoundError("Subcategory Not Found");

   res.send(subcategory);
});

export default subcatRoute;
