import IPrice from "../../Interfaces/Product/IPrice";

export default abstract class ProductPrice implements IPrice {
  public abstract price: number;
  public abstract qtyMin: number;
  public abstract qtyMax: number;
}
