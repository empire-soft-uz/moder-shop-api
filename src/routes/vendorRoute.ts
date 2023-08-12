import { Response, Router, Request } from "express";
import "express-async-errors";
import { vendorCreation } from "../Validation/VendorRules";
import Vendor from "../Models/Vendor";
import NotFoundError from "../Classes/Errors/NotFoundError";
import { isSuperAdmin } from "../middlewares/validateAdmin";
const vendorRoute = Router();
vendorRoute.get("/", async (req: Request, res: Response) => {
  const vendors = await Vendor.find().populate({
    path: "products",
    model: "Product",
  });
  res.send(vendors);
});
vendorRoute.post(
  "/new",
  [...vendorCreation],
  async (req: Request, res: Response) => {
    const vendor = Vendor.build(req.body);
    await vendor.save();
    res.send(vendor);
  }
);

vendorRoute.put(
  "/edit/:id",
  [...vendorCreation],
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
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
