import { Model, Schema, model } from "mongoose";
interface order {
  productId: string;
  userId: string;
  qty: number;
}
interface OrderDoc extends Document {
  productId: string;
  userId: string;
  qty: number;
}
interface OrderModel extends Model<OrderDoc> {
  build(attrs: order): OrderDoc;
}

const orderSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, default: 1 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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

orderSchema.statics.build = (attrs: order): OrderDoc => {
  return new Order(attrs);
};
const Order = model<OrderDoc, OrderModel>("Order", orderSchema);
export default Order;
