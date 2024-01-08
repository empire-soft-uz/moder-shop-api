import { Response, Router, Request } from "express";
import "express-async-errors";
import { vendorCreation } from "../Validation/VendorRules";
import Vendor from "../Models/Vendor";
import NotFoundError from "../Classes/Errors/NotFoundError";
import { isSuperAdmin } from "../middlewares/validateAdmin";
import Product from "../Models/Product";
import MediaManager from "../utils/MediaManager";
import Admin from "../Models/Admin";
import multer from "multer";
const vendorRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });
vendorRoute.get("/admin", isSuperAdmin, async (req: Request, res: Response) => {
  // const vendors = await Vendor.aggregate([
  //   {
  //     $lookup: {
  //       from: "admins",
  //       localField: "_id",
  //       foreignField: "vendorId",
  //       as: "admin",
  //     },
  //   },
  //   { $unwind: "$admin" },
  //   {
  //     $project: {
  //       id: "$_id",
  //       name: "$name",
  //       contacts: "$contacts",
  //       baner: "$baner",
  //       "admin.id": "$admin._id",
  //       "admin.email": "$admin.email",
  //     },
  //   },
  //   { $unset: ["_id", "admin._id"] },
  // ]);
  const vendors = await Vendor.find();
  res.send(vendors);
});
vendorRoute.get("/", async (req: Request, res: Response) => {
  // const vendors = await Vendor.aggregate([
  //   {
  //     $lookup: {
  //       from: "admins",
  //       localField: "_id",

  //       foreignField: "vendorId",
  //       as: "admin",
  //     },
  //   },
  //   { $unwind: "$admin" },
  //   {
  //     $project: {
  //       id: "$_id",
  //       name: "$name",
  //       contacts: "$contacts",
  //       baner: "$baner",
  //       "admin.id": "$admin._id",
  //       "admin.email": "$admin.email",
  //     },
  //   },
  //   { $unset: ["_id", "admin._id"] },
  // ]);
  const vendors = await Vendor.find();
  res.send(vendors);
});
vendorRoute.post(
  "/new",
  isSuperAdmin,
  [...vendorCreation],
  upload.single("baner"),
  async (req: Request, res: Response) => {
    const { name, description, phoneNumber } = req.body;
    const vendor = Vendor.build({
      name,
      description,
      contacts: { phoneNumber },
    });
    console.log(vendor);
    if (req.file) {
      const baner = await MediaManager.uploadFile(req.file);
      vendor.baner = baner;
    }
    await vendor.save();
    res.send(vendor);
  }
);

vendorRoute.put(
  "/edit/:id",
  upload.single("baner"),
  isSuperAdmin,
  [...vendorCreation],
  async (req: Request, res: Response) => {
    const { name, desc, phoneNumber, oldBaner } = req.body;
    let update = {
      name,
      description: desc,
      contacts: { phoneNumber },
    };

    if (req.file) {
      const temp = [MediaManager.uploadFile(req.file)];
      if (oldBaner) {
        //@ts-ignore
        temp.push(MediaManager.deletefiles(JSON.parse(oldBaner)));
      }
      const res = await Promise.all(temp);
      //@ts-ignore
      update.baner = res[0];
    }
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { ...update },
      { new: true }
    );
    res.send(vendor);
  }
);

vendorRoute.get("/:id", async (req: Request, res: Response) => {
  const vendor = await Vendor.findById(req.params.id).populate({
    path: "products",
    model: "VendorProduct",
  });
  if (!vendor) throw new NotFoundError("Vendor Not Found");

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
      if (vendor.baner) {
        delImages.push(MediaManager.deletefiles(vendor.baner));
      }
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
