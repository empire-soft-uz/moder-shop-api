"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var orderStatus;
(function (orderStatus) {
    orderStatus["new"] = "new";
    orderStatus["approved"] = "approved";
    orderStatus["delivering"] = "delivering";
    orderStatus["completed"] = "completed";
})(orderStatus || (orderStatus = {}));
const productSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    price: Number
}, { id: false, _id: false });
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    products: [productSchema],
    deliveryAddress: String,
    total: Number,
    //vendor:{ type: Schema.Types.ObjectId, ref: "Vendor" },
    orderStatus: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.new,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
orderSchema.statics.build = (attrs) => {
    return new Order(attrs);
};
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
