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
exports.default = subcatRoute;
