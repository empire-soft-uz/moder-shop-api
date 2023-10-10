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
const mongoose_1 = require("mongoose");
const Review_1 = __importDefault(require("./Review"));
const Subcateygory_1 = __importDefault(require("./Subcateygory"));
const Vendor_1 = __importDefault(require("./Vendor"));
const Category_1 = __importDefault(require("./Category"));
const PropValue_1 = __importDefault(require("./PropValue"));
const Admin_1 = __importDefault(require("./Admin"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const User_1 = __importDefault(require("./User"));
const priceSchema = new mongoose_1.Schema({
    price: Number,
    oldPrice: { type: Number, default: 0 },
    qtyMin: Number,
    qtyMax: Number,
}, { id: false, _id: false });
const mediaSchema = new mongoose_1.Schema({
    name: String,
    fileId: String,
}, { id: false, _id: false });
const productSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: Vendor_1.default },
    name: String,
    description: String,
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: Admin_1.default },
    price: [priceSchema],
    props: [{ type: mongoose_1.Schema.Types.ObjectId, ref: PropValue_1.default }],
    media: [mediaSchema],
    video: mediaSchema,
    viewCount: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: User_1.default }],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: Category_1.default },
    subcategory: { type: mongoose_1.Schema.Types.ObjectId, ref: Subcateygory_1.default },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: Review_1.default }],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
productSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield Review_1.default.deleteMany({
                _id: { $in: doc.reviews },
            });
        }
    });
});
productSchema.statics.build = (attrs) => {
    return new Product(attrs);
};
productSchema.statics.likeProduct = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product.findById(id)
        .populate("vendorId", "name")
        .populate("category", "name id")
        .populate("subcategory", "name id")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    if (product.likes.find((l) => {
        if (l.toString() === userId) {
            return l;
        }
        return false;
    })) {
        //@ts-ignore
        product.likes.pull(userId);
        return product.save();
    }
    product.likes.push(userId);
    return product.save();
});
const Product = (0, mongoose_1.model)("Product", productSchema);
exports.default = Product;
