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
const validateAdmin_1 = require("../middlewares/validateAdmin");
const SubcatRules_1 = require("../Validation/SubcatRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const Subcateygory_1 = __importDefault(require("../Models/Subcateygory"));
const Category_1 = __importDefault(require("../Models/Category"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
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
    const { admin } = req.query;
    const subcategory = yield Subcateygory_1.default.findById(req.params.id).populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    });
    if (admin) {
        res.send(subcategory);
        return;
    }
    let temp = {};
    subcategory === null || subcategory === void 0 ? void 0 : subcategory.props.map((p, i) => {
        const name = p.prop.name.split(" ").join("_");
        if (temp[name]) {
            temp[name].props.push(p);
        }
        else {
            temp[name] = { id: p.prop.id, label: p.prop.label, props: [p] };
        }
    });
    res.send(subcategory
        ? { id: subcategory.id, name: subcategory.name, props: temp }
        : {});
}));
subcatRoute.put("/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, removedProps, newProps } = req.body;
    const subcategory = yield Subcateygory_1.default.findById(req.params.id);
    if (!subcategory)
        throw new NotFoundError_1.default("Subcategory Not Found");
    if (name) {
        subcategory.name = name;
    }
    let tempProps = [];
    if (removedProps && removedProps.length > 0) {
        tempProps = subcategory.props.filter((p) => {
            if (!removedProps.find((r) => r === p)) {
                return p;
            }
        });
    }
    if (newProps && newProps.length > 0) {
        tempProps.push(...newProps);
    }
    const uniqueProps = new Set(tempProps);
    subcategory.props = Array.from(uniqueProps);
    yield subcategory.save();
    res.send(subcategory);
}));
exports.default = subcatRoute;
