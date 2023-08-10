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
categoryRoute.put("/edit/:id", validateAdmin_1.isSuperAdmin, upload.single("icon"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const category = yield Category_1.default.findById(req.params.id);
    if (!category)
        throw new NotFoundError_1.default("Category not found");
    if (!name)
        throw new BadRequestError_1.default("Category name is required");
    if (req.file) {
        const fns = [];
        if (category.icon) {
            fns.push(MediaManager_1.default.deletefiles(category.icon));
        }
        fns.push(MediaManager_1.default.uploadFile(req.file));
        const [icon] = yield Promise.all(fns);
        category.icon = icon;
    }
    category.name = name;
    yield category.save();
    res.send(category);
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
categoryRoute.post("/new/many", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories } = req.body;
    const newCts = yield Category_1.default.insertMany(categories);
    res.send(newCts);
}));
categoryRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findById(req.params.id).populate("subcategories");
    if (!category)
        throw new NotFoundError_1.default("Category Not Found");
    res.send(category);
}));
categoryRoute.delete("/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findByIdAndDelete(req.params.id);
    const asyncFns = [];
    if (!category)
        throw new NotFoundError_1.default("Category not found");
    asyncFns.push(Subcateygory_1.default.deleteMany({ _id: { $in: category.subcategories } }));
    if (category.icon) {
        asyncFns.push(MediaManager_1.default.deletefiles(category.icon));
    }
    yield Promise.all(asyncFns);
    res.send(category);
}));
exports.default = categoryRoute;
