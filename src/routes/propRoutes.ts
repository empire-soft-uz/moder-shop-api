import "express-async-errors";
import { Router, Request, Response } from "express";
import { isSuperAdmin } from "../middlewares/validateAdmin";
import { propCreation } from "../Validation/PropRules";
import Validator from "../utils/Valiadtor";
import Prop from "../Models/Prop";
import Subcategory from "../Models/Subcateygory";
import NotFoundError from "../Classes/Errors/NotFoundError";
import BadRequestError from "../Classes/Errors/BadRequestError";
import PropValue from "../Models/PropValue";

const propRoutes = Router();
propRoutes.post(
  "/new",
  isSuperAdmin,
  [...propCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { name, label, values } = req.body;
    if (!values || !Array.isArray(values) || values.length < 0)
      throw new BadRequestError("Property values are required");
    const prop = Prop.build({ name, label });
    await prop.save();
    const vals = [];
    for await (const val of values) {
      const newVal = PropValue.build({ value: val, prop: prop.id });
      vals.push(newVal);
      await newVal.save();
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.body.subcategory,
      { $push: { props: { $each: vals } } }
    );
    if (!subcategory) throw new NotFoundError("Suncategory not found");
    await subcategory.save();
    res.send(vals);
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
