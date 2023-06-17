import { Response, Router, Request } from "express";
import "express-async-errors";
import { vendorCreation } from "../Validation/VendorRules";
import Vendor from "../Models/Vendor";
import NotFoundError from "../Classes/Errors/NotFoundError";
const vendorRoute = Router();
vendorRoute.post(
  "/new",
  [...vendorCreation],
  async (req: Request, res: Response) => {
    const vendor = Vendor.build(req.body);
    await vendor.save();
    res.send(vendor);
  }
);
vendorRoute.get("/:id", async (req: Request, res: Response) => {
  const vendor = await Vendor.findById(req.params.id).populate({
    path: "products",
    model: "Product",
  });
  if (!vendor) throw new NotFoundError("Vendor Not Found");
  res.send(vendor);
});

export default vendorRoute;
