import IPrice from "../../Interfaces/Product/IPrice";

export default class ProductPrice implements IPrice {
  constructor(
    public price: number,
    public qtyMin: number,
    public qtyMax: number
  ) {}
}
