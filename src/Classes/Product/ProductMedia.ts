import IProductMedia from "../../Interfaces/Product/IProducMedia";

export default abstract class ProductMedia implements IProductMedia {
  public abstract url: string;
}
