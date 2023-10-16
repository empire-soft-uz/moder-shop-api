"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
require("express-async-errors");
const VendorRules_1 = require("../Validation/VendorRules");
const Vendor_1 = __importDefault(require("../Models/Vendor"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const validateAdmin_1 = require("../middlewares/validateAdmin");
const Product_1 = __importDefault(require("../Models/Product"));
const MediaManager_1 = __importDefault(require("../utils/MediaManager"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const multer_1 = __importDefault(require("multer"));
const vendorRoute = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 50 * 1048576 } });
vendorRoute.get("/admin", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vendor_1.default.aggregate([
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
        { $unset: ["_id", "admin._id"] },
    ]);
    res.send(vendors);
}));
vendorRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vendor_1.default.aggregate([
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
        { $unset: ["_id", "admin._id"] },
    ]);
    res.send(vendors);
}));
vendorRoute.post("/new", validateAdmin_1.isSuperAdmin, [...VendorRules_1.vendorCreation], upload.single("baner"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, desc, phoneNumber } = req.body;
    const vendor = Vendor_1.default.build({
        name,
        description: desc,
        contacts: { phoneNumber },
    });
    if (req.file) {
        const baner = yield MediaManager_1.default.uploadFile(req.file);
        vendor.baner = baner;
    }
    yield vendor.save();
    res.send(vendor);
}));
vendorRoute.put("/edit/:id", upload.single("baner"), validateAdmin_1.isSuperAdmin, [...VendorRules_1.vendorCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, desc, phoneNumber, oldBaner } = req.body;
    let update = {
        name,
        description: desc,
        contacts: { phoneNumber },
    };
    if (req.file) {
        const temp = [MediaManager_1.default.uploadFile(req.file)];
        if (oldBaner) {
            //@ts-ignore
            temp.push(MediaManager_1.default.deletefiles(JSON.parse(oldBaner)));
        }
        const res = yield Promise.all(temp);
        //@ts-ignore
        update.baner = res[0];
    }
    console.log(update);
    const vendor = yield Vendor_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, update), { new: true });
    res.send(vendor);
}));
vendorRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield Vendor_1.default.findById(req.params.id).populate({
        path: "products",
        model: "Product",
    });
    if (!vendor)
        throw new NotFoundError_1.default("Vendor Not Found");
    res.send(vendor);
}));
vendorRoute.delete("/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const delVendor = yield Promise.all([
        Vendor_1.default.findByIdAndDelete(req.params.id),
        Admin_1.default.findOneAndDelete({ vendorId: req.params.id }),
    ]);
    const vendor = delVendor[0];
    if (!vendor)
        throw new NotFoundError_1.default("Vendor Not Found");
    const products = yield Product_1.default.find({ vendorId: req.params.id });
    if (products.length > 0) {
        const delImages = [];
        if (vendor.baner) {
            delImages.push(MediaManager_1.default.deletefiles(vendor.baner));
        }
        products.forEach((p) => {
            if (p.media && p.media.length > 0) {
                p.media.forEach((m) => {
                    delImages.push(MediaManager_1.default.deletefiles(m));
                });
            }
            if (p.video) {
                delImages.push(MediaManager_1.default.deletefiles(p.video));
            }
        });
        delImages.push(Product_1.default.deleteMany({ vendorId: req.params.id }));
        const result = yield Promise.all(delImages);
        console.log(result);
        res.send(result);
        return;
    }
    res.send(vendor);
}));
exports.default = vendorRoute;
