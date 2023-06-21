import IOrderProducts from "./IOrderProducts";

export default interface IOrder {
  id: string;
  products: Array<IOrderProducts>;
  userId: string;
  deliveryAddress: string;
}
