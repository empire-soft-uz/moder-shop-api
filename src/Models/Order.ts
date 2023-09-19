import { Model, Schema, model, Document } from "mongoose";
import IOrderProducts from "../Interfaces/Order/IOrderProducts";

enum orderStatus {
  new = "new",
  approved = "approved",
  delivering = "delivering",
  completed = "completed",
}
interface order {
  products: Array<IOrderProducts>;
  userId: Schema.Types.ObjectId;
  deliveryAddress: string;
  status: orderStatus;
}
interface OrderDoc extends Document {
  products: Array<IOrderProducts>;
  userId: Schema.Types.ObjectId;
  deliveryAddress: string;
  total:number
  status: orderStatus;
  //vendor:Schema.Types.ObjectId;
}
interface OrderModel extends Model<OrderDoc> {
  build(attrs: order): OrderDoc;
}
const productSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    price:Number
  },
  { id: false, _id: false }
);
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [productSchema],
    deliveryAddress: String,
    total:Number,
    //vendor:{ type: Schema.Types.ObjectId, ref: "Vendor" },
    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.new,
    },
  },
  {
    timestamps:true,
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
