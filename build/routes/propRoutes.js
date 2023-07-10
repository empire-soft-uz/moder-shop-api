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
require("express-async-errors");
const express_1 = require("express");
const validateAdmin_1 = require("../middlewares/validateAdmin");
const PropRules_1 = require("../Validation/PropRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const Prop_1 = __importDefault(require("../Models/Prop"));
const Subcateygory_1 = __importDefault(require("../Models/Subcateygory"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const propRoutes = (0, express_1.Router)();
propRoutes.post("/new", validateAdmin_1.isSuperAdmin, [...PropRules_1.propCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const prop = Prop_1.default.build(req.body);
    yield prop.save();
    const subcategory = yield Subcateygory_1.default.findByIdAndUpdate(req.body.subcategory, { $push: { props: prop.id } });
    if (!subcategory)
        throw new NotFoundError_1.default("Suncategory not found");
    res.send({
        prop,
        subcategory: { id: subcategory.id, name: subcategory === null || subcategory === void 0 ? void 0 : subcategory.name },
    });
}));
propRoutes.delete("/delete/:id/:subcategoryId", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prop = yield Prop_1.default.findByIdAndDelete(req.params.id);
    if (!prop)
        throw new NotFoundError_1.default("Property not found");
    const subcategory = yield Subcateygory_1.default.findByIdAndUpdate(req.params.subcategoryId, { $pull: { props: prop.id } });
    res.send({ prop, subcategory });
}));
exports.default = propRoutes;
