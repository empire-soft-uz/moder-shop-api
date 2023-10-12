"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductPrice {
    constructor(price, qtyMin, qtyMax, oldPrice) {
        this.price = price;
        this.qtyMin = qtyMin;
        this.qtyMax = qtyMax;
        this.oldPrice = oldPrice;
    }
}
exports.default = ProductPrice;
