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
const express_1 = require("express");
require("express-async-errors");
const Category_1 = __importDefault(require("../Models/Category"));
const validateAdmin_1 = require("../middlewares/validateAdmin");
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const multer_1 = __importDefault(require("multer"));
const MediaManager_1 = __importDefault(require("../utils/MediaManager"));
const Subcateygory_1 = __importDefault(require("../Models/Subcateygory"));
const categoryRoute = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 50 * 1048576 } });
categoryRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find().populate("subcategories");
    res.send(categories);
}));
categoryRoute.post("/new", validateAdmin_1.isSuperAdmin, upload.single("icon"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name)
        throw new BadRequestError_1.default("Category name is required");
    const category = Category_1.default.build({ name });
    if (req.file) {
        const icon = yield MediaManager_1.default.uploadFile(req.file);
        category.icon = icon;
    }
    yield category.save();
    res.send(category);
}));
categoryRoute.delete("/category/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const category = yield Category_1.default.findByIdAndDelete(req.params.id);
    if (!category)
        throw new NotFoundError_1.default("Category not found");
    if (category.icon) {
        yield MediaManager_1.default.deletefiles(category.icon);
    }
    try {
        for (var _d = true, _e = __asyncValues(category.subcategories), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const subCt = _c;
            yield Subcateygory_1.default.findByIdAndDelete(subCt);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.send(category);
}));
exports.default = categoryRoute;
