import "express-async-errors";
import { Router, Request, Response } from "express";
import { isSuperAdmin } from "../middlewares/validateAdmin";
import { propCreation } from "../Validation/PropRules";
import Validator from "../utils/Valiadtor";
import Prop from "../Models/Prop";
import Subcategory from "../Models/Subcateygory";
import NotFoundError from "../Classes/Errors/NotFoundError";

const propRoutes = Router();
propRoutes.post(
  "/new",
  isSuperAdmin,
  [...propCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const prop = Prop.build(req.body);
    await prop.save();
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.body.subcategory,
      { $push: { props: prop.id } }
    );
    if (!subcategory) throw new NotFoundError("Suncategory not found");
    res.send({
      prop,
      subcategory: { id: subcategory.id, name: subcategory?.name },
    });
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
