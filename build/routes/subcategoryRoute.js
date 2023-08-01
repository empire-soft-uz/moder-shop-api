"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const validateAdmin_1 = __importStar(require("../middlewares/validateAdmin"));
const SubcatRules_1 = require("../Validation/SubcatRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const Subcateygory_1 = __importDefault(require("../Models/Subcateygory"));
const Category_1 = __importDefault(require("../Models/Category"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const subcatRoute = (0, express_1.Router)();
subcatRoute.post("/new", [...SubcatRules_1.subcatCreation], validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { name, props, category } = req.body;
    const parentCat = yield Category_1.default.findById(category);
    if (!parentCat)
        throw new BadRequestError_1.default("Invalid category is provided");
    const subCt = Subcateygory_1.default.build(req.body);
    yield subCt.save();
    parentCat.subcategories.push(subCt.id);
    yield parentCat.save();
    res.send(subCt);
}));
subcatRoute.post("/new/many", 
// [...subcatCreation],
validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subcategories, category } = req.body;
    const parentCat = yield Category_1.default.findById(category);
    if (!parentCat)
        throw new BadRequestError_1.default("Invalid category is provided");
    const subcts = yield Subcateygory_1.default.insertMany(subcategories);
    subcts.forEach((subCt) => {
        parentCat.subcategories.push(subCt.id);
    });
    yield parentCat.save();
    res.send({ category: parentCat, subcts });
}));
subcatRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subCts = yield Subcateygory_1.default.find();
    res.send(subCts);
}));
subcatRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
    const subcategory = yield Subcateygory_1.default.findById(req.params.id).populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    });
    res.send(subcategory);
}));
subcatRoute.put("/:id", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, removedProps, newProps } = req.body;
    let updating = {};
    if (name) {
        updating = Object.assign(Object.assign({}, updating), { name });
    }
    if (removedProps && removedProps.length > 0) {
        updating = Object.assign(Object.assign({}, updating), { $pullAll: { props: removedProps } });
    }
    if (newProps && newProps.length > 0) {
        updating = Object.assign(Object.assign({}, updating), { $push: { props: { $each: newProps } } });
    }
    const subcategory = yield Subcateygory_1.default.findByIdAndUpdate(req.params.id, updating);
    res.send(subcategory);
}));
exports.default = subcatRoute;
