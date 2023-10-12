import IPrice from "../../Interfaces/Product/IPrice";
export default class ProductPrice implements IPrice {
    price: number;
    qtyMin: number;
    qtyMax: number;
    oldPrice: number;
    constructor(price: number, qtyMin: number, qtyMax: number, oldPrice: number);
}
