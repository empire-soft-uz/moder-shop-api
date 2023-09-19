import { Model, Schema, Document } from "mongoose";
import IOrderProducts from "../Interfaces/Order/IOrderProducts";
declare enum orderStatus {
    new = "new",
    approved = "approved",
    delivering = "delivering",
    completed = "completed"
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
    total: number;
    status: orderStatus;
}
interface OrderModel extends Model<OrderDoc> {
    build(attrs: order): OrderDoc;
}
declare const Order: OrderModel;
export default Order;
