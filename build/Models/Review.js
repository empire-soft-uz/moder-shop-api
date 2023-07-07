"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productMediaSchema = new mongoose_1.Schema({
    url: String,
}, { id: false, _id: false });
const reviewSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    createdDate: { type: Date, default: new Date() },
    review: String,
    rating: { type: Number, min: 0, max: 5 },
    imgs: [productMediaSchema],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
reviewSchema.statics.build = (attrs) => {
    return new Review(attrs);
};
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
