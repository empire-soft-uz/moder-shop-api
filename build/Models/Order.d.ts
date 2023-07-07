import { Model, Schema, Document } from "mongoose";
import IOrderProducts from "../Interfaces/Order/IOrderProducts";
interface order {
    products: Array<IOrderProducts>;
    userId: Schema.Types.ObjectId;
    deliveryAddress: string;
}
interface OrderDoc extends Document {
    products: Array<IOrderProducts>;
    userId: Schema.Types.ObjectId;
    deliveryAddress: string;
}
interface OrderModel extends Model<OrderDoc> {
    build(attrs: order): OrderDoc;
}
declare const Order: OrderModel;
export default Order;
