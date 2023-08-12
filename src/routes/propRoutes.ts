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

const propRoutes = Router();
propRoutes.get("/", async (req: Request, res: Response) => {
  const properties = await Prop.find();
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
  console.log(propVals);
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
    if (!req.body.prop.name || !req.body.prop.label)
      throw new BadRequestError("All fields are required");
    const updatedProp = await Prop.findByIdAndUpdate(
      req.params.propId,
      {
        ...req.body.prop,
      },
      { new: true }
    );
    res.send(updatedProp);
  }
);
propRoutes.get("/:propId", async (req: Request, res: Response) => {
  const [prop, vals] = await Promise.all([
    Prop.findById(req.params.propId),
    PropValue.find({ prop: req.params.propId }),
  ]);
  res.send({ prop, values: vals });
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
    console.log(newVals);
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
export default propRoutes;
