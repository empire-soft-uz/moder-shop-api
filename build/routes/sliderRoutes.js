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
const Slider_1 = __importDefault(require("../Models/Slider"));
const multer_1 = __importDefault(require("multer"));
const validateAdmin_1 = require("../middlewares/validateAdmin");
const SliderRules_1 = require("../Validation/SliderRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const MediaManager_1 = __importDefault(require("../utils/MediaManager"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const sliderRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 50 * 1048576 } });
sliderRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slider = yield Slider_1.default.find();
    res.send(slider);
}));
sliderRouter.post("/new", validateAdmin_1.isSuperAdmin, [...SliderRules_1.sliderCreation], upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    if (!req.file)
        throw new BadRequestError_1.default("Slider Image is Required");
    const slide = Slider_1.default.build(req.body);
    slide.image = yield MediaManager_1.default.uploadFile(req.file);
    yield slide.save();
    res.send(slide);
}));
sliderRouter.delete("/delete/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slide = yield Slider_1.default.findByIdAndDelete(req.params.id);
    if (!slide)
        throw new NotFoundError_1.default("Slide Not Found");
    yield MediaManager_1.default.deletefiles(slide.image);
    res.send(slide);
}));
exports.default = sliderRouter;
