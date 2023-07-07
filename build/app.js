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
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
require("express-async-errors");
const NotFoundError_1 = __importDefault(require("./Classes/Errors/NotFoundError"));
const validateUser_1 = __importDefault(require("./middlewares/validateUser"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const vendorRoute_1 = __importDefault(require("./routes/vendorRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const subcategoryRoute_1 = __importDefault(require("./routes/subcategoryRoute"));
const propRoutes_1 = __importDefault(require("./routes/propRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("protected route");
}));
app.use("/api/admins", adminRoutes_1.default);
app.use("/api/users", userRoute_1.default);
app.use("/api/categories", categoryRoute_1.default);
app.use("/api/subcategories", subcategoryRoute_1.default);
app.use("/api/props", propRoutes_1.default);
app.use("/api/products", productRoute_1.default);
app.use("/api/vendors", vendorRoute_1.default);
app.use("/api/reviews", reviewRoute_1.default);
app.use("/api/orders", orderRoute_1.default);
app.all("*", (req, res, next) => {
    throw new NotFoundError_1.default("Not Found");
});
app.use(errorHandler_1.default);
exports.default = app;
