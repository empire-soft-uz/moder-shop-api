import { Model, Schema, model } from "mongoose";
interface admin {
  email: string;
  password: string;
  vendorId: string;
}
interface AdminDoc extends Document {
  email: string;
  password: string;
  vendorId: string;
}
interface AdminModel extends Model<AdminDoc> {
  build(attrs: admin): AdminDoc;
}

const adminSchema = new Schema(
  {
    email: String,
    password: String,
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

adminSchema.statics.build = (attrs: admin): AdminDoc => {
  return new Admin(attrs);
};
const Admin = model<AdminDoc, AdminModel>("Admin", adminSchema);
