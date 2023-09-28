import { Response, Router, Request } from "express";
import "express-async-errors";
import { vendorCreation } from "../Validation/VendorRules";
import Vendor from "../Models/Vendor";
import NotFoundError from "../Classes/Errors/NotFoundError";
import { isSuperAdmin } from "../middlewares/validateAdmin";
import Product from "../Models/Product";
import MediaManager from "../utils/MediaManager";
import Admin from "../Models/Admin";
const vendorRoute = Router();
vendorRoute.get("/", async (req: Request, res: Response) => {
  // const vendors = await Vendor.find().populate({
  //   path: "products",
  //   model: "Product",
  // });
  const vendors = await Vendor.aggregate([
    {
      $lookup: {
        from: "admins",
        localField: "_id",
        foreignField: "vendorId",
        as: "admin",
      },
    },
    { $unwind: "$admin" },
    {
      $project: {
        id: "$_id",
        name: "$name",
        contacts: "$contacts",
        "admin.id": "$admin._id",
        "admin.email": "$admin.email",
      },
    },
    { $unset: [ "_id", "admin._id",  ] }
  ]);
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
  console.log(vendor);
  res.send(vendor);
});
vendorRoute.delete(
  "/:id",
  isSuperAdmin,
  async (req: Request, res: Response) => {
    const delVendor = await Promise.all([
      Vendor.findByIdAndDelete(req.params.id),
      Admin.findOneAndDelete({ vendorId: req.params.id }),
    ]);
    const vendor = delVendor[0];
    if (!vendor) throw new NotFoundError("Vendor Not Found");

    const products = await Product.find({ vendorId: req.params.id });
    if (products.length > 0) {
      const delImages = [];
      products.forEach((p) => {
        if (p.media && p.media.length > 0) {
          p.media.forEach((m) => {
            delImages.push(MediaManager.deletefiles(m));
          });
        }
        if (p.video) {
          delImages.push(MediaManager.deletefiles(p.video));
        }
      });
      delImages.push(Product.deleteMany({ vendorId: req.params.id }));
      const result = await Promise.all(delImages);
      console.log(result);
      res.send(result);
      return;
    }

    res.send(vendor);
  }
);

export default vendorRoute;
