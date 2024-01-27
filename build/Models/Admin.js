"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vendor" },
    online: { type: Boolean, default: false },
    super: { type: Boolean, default: false },
    root: { type: Boolean, default: false },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
adminSchema.statics.build = (attrs) => {
    return new Admin(attrs);
};
const Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = Admin;
