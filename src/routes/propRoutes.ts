import "express-async-errors";
import { Router, Request, Response } from "express";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import { propCreation } from "../Validation/PropRules";
import Validator from "../utils/Valiadtor";
import Prop from "../Models/Prop";
import Subcategory from "../Models/Subcateygory";
import NotFoundError from "../Classes/Errors/NotFoundError";
import BadRequestError from "../Classes/Errors/BadRequestError";
import PropValue from "../Models/PropValue";
import PropFormater from "../utils/PropFormater";
import Product from "../Models/Product";

const propRoutes = Router();
propRoutes.get("/", async (req: Request, res: Response) => {
  const properties = await Prop.find();
  if (!properties) throw new NotFoundError("Properties not found");
  res.send(properties);
});
propRoutes.get("/values", async (req: Request, res: Response) => {
  const properties = await PropValue.find().populate("prop");
  if (!properties) throw new NotFoundError("Properties not found");
  res.send(properties);
});

propRoutes.post(
  "/new",
  isSuperAdmin,
  [...propCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { name, label } = req.body;

    const prop = Prop.build({ name, label });
    await prop.save();

    res.send(prop);
  }
);
propRoutes.post(
  "/new/many",
  isSuperAdmin,

  async (req: Request, res: Response) => {
    const { props } = req.body;

    const newprops = await Prop.insertMany(props);

    res.send(newprops);
  }
);
propRoutes.post("/values/new/many", async (req: Request, res: Response) => {
  const { values, subcategory } = req.body;

  const propVals = await PropValue.insertMany(values);
  const vals = [];

  propVals.forEach((v) => vals.push(v.id));
  const subct = await Subcategory.findByIdAndUpdate(req.body.subcategory, {
    $push: { props: { $each: vals } },
  });
  if (!subcategory) throw new NotFoundError("Suncategory not found");
  res.send({ values: vals });
});
//updating prop value
propRoutes.put(
  "/values/update/:valueId",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const { value, prop } = req.body;
    const updated = await PropValue.findByIdAndUpdate(req.params.valueId, {
      ...req.body,
    });
    res.send(updated);
  }
);
//updating prop itself
propRoutes.put(
  "/edit/:propId",
  validateAdmin,
  async (req: Request, res: Response) => {
    if (!req.body.name || !req.body.label)
      throw new BadRequestError("All fields are required");
    const updatedProp = await Prop.findByIdAndUpdate(
      req.params.propId,
      {
        ...req.body,
      },
      { new: true }
    );
    res.send(updatedProp);
  }
);
propRoutes.get("/prop/:propId", async (req: Request, res: Response) => {
  const props=await PropValue.find({ prop: req.params.propId }).populate('prop')
  if(!props) throw new NotFoundError('Property Not Found')
   const formatedProps=PropFormater.format(props)

   res.send(formatedProps[0]);
});
propRoutes.get("/:propId", async (req: Request, res: Response) => {

  const props=await Prop.findById( req.params.propId )
 if(!props) throw new NotFoundError('Property Not Found')
 
  res.send(props);
});

propRoutes.get("/values/:valueId", async (req: Request, res: Response) => {
  const value = await PropValue.findById(req.params.valueId);
  res.send(value);
});

//creating values without binding to subcategory
propRoutes.post(
  "/values/new/:propId",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const { values } = req.body;
    const { propId } = req.params;
    const prop = await Prop.findById(propId);
    if (!prop) throw new NotFoundError("Given property not found");
    if (!values || !Array.isArray(values) || values.length < 0)
      throw new BadRequestError("Property values are required");
    const vals: [{ value: string; prop: string }] = [];
    values.forEach((v) => {
      vals.push({ value: v, prop: prop.id });
    });
    const newVals = await PropValue.insertMany(vals);
    
    res.send({ values: newVals });
  }
);

propRoutes.delete(
  "/delete/:id/:subcategoryId",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const prop = await Prop.findByIdAndDelete(req.params.id);
    if (!prop) throw new NotFoundError("Property not found");
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.subcategoryId,
      { $pull: { props: prop.id } }
    );
    res.send({ prop, subcategory });
  }
);
propRoutes.delete(
  "/delete/:id",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const prop = await Prop.findByIdAndDelete(req.params.id);
    //const delProducts=await Product.deleteMany({prop:{$in:delVals}})
    res.send(prop);
  }
);
export default propRoutes;
