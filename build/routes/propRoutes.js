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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = require("express");
const validateAdmin_1 = __importStar(require("../middlewares/validateAdmin"));
const PropRules_1 = require("../Validation/PropRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const Prop_1 = __importDefault(require("../Models/Prop"));
const Subcateygory_1 = __importDefault(require("../Models/Subcateygory"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const PropValue_1 = __importDefault(require("../Models/PropValue"));
const propRoutes = (0, express_1.Router)();
propRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = yield Prop_1.default.find();
    if (!properties)
        throw new NotFoundError_1.default("Properties not found");
    res.send(properties);
}));
propRoutes.post("/new", validateAdmin_1.isSuperAdmin, [...PropRules_1.propCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { name, label } = req.body;
    const prop = Prop_1.default.build({ name, label });
    yield prop.save();
    res.send(prop);
}));
propRoutes.post("/new/many", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { props } = req.body;
    const newprops = yield Prop_1.default.insertMany(props);
    res.send(newprops);
}));
propRoutes.post("/values/new/many", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { values, subcategory } = req.body;
    const propVals = yield PropValue_1.default.insertMany(values);
    const vals = [];
    console.log(propVals);
    propVals.forEach((v) => vals.push(v.id));
    const subct = yield Subcateygory_1.default.findByIdAndUpdate(req.body.subcategory, {
        $push: { props: { $each: vals } },
    });
    if (!subcategory)
        throw new NotFoundError_1.default("Suncategory not found");
    res.send({ values: vals });
}));
propRoutes.put("/values/update/:valueId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, prop } = req.body;
    const updated = yield PropValue_1.default.findByIdAndUpdate(req.params.valueId, Object.assign({}, req.body));
    res.send(updated);
}));
propRoutes.put("/edit/:propId", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.prop.name || !req.body.prop.label)
        throw new BadRequestError_1.default("All fields are required");
    const updatedProp = yield Prop_1.default.findByIdAndUpdate(req.params.propId, Object.assign({}, req.body.prop), { new: true });
    res.send(updatedProp);
}));
propRoutes.get("/:propId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [prop, vals] = yield Promise.all([
        Prop_1.default.findById(req.params.propId),
        PropValue_1.default.find({ prop: req.params.propId }),
    ]);
    res.send({ prop, values: vals });
}));
propRoutes.post("/values/new/:propId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const { values } = req.body;
    const { propId } = req.params;
    const prop = yield Prop_1.default.findById(propId);
    if (!prop)
        throw new NotFoundError_1.default("Given property not found");
    if (!values || !Array.isArray(values) || values.length < 0)
        throw new BadRequestError_1.default("Property values are required");
    const vals = [];
    try {
        for (var _d = true, values_1 = __asyncValues(values), values_1_1; values_1_1 = yield values_1.next(), _a = values_1_1.done, !_a; _d = true) {
            _c = values_1_1.value;
            _d = false;
            const val = _c;
            const newVal = PropValue_1.default.build({ value: val, prop: propId });
            vals.push(newVal);
            yield newVal.save();
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = values_1.return)) yield _b.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const subcategory = yield Subcateygory_1.default.findByIdAndUpdate(req.body.subcategory, { $push: { props: { $each: vals } } });
    if (!subcategory)
        throw new NotFoundError_1.default("Suncategory not found");
    res.send({ values: vals });
}));
propRoutes.delete("/delete/:id/:subcategoryId", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prop = yield Prop_1.default.findByIdAndDelete(req.params.id);
    if (!prop)
        throw new NotFoundError_1.default("Property not found");
    const subcategory = yield Subcateygory_1.default.findByIdAndUpdate(req.params.subcategoryId, { $pull: { props: prop.id } });
    res.send({ prop, subcategory });
}));
exports.default = propRoutes;
