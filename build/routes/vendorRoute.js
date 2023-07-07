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
const vendorRoute = (0, express_1.Router)();
vendorRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vendor_1.default.find();
    res.send(vendors);
}));
vendorRoute.post("/new", [...VendorRules_1.vendorCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = Vendor_1.default.build(req.body);
    yield vendor.save();
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
exports.default = vendorRoute;
