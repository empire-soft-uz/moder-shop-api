import { Response, Router, Request } from "express";
import "express-async-errors";
import { vendorCreation } from "../Validation/VendorRules";
import Vendor from "../Models/Vendor";
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

export default vendorRoute;
