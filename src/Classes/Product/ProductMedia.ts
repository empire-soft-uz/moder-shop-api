import IProductMedia from "../../Interfaces/Product/IProducMedia";

export default class ProductMedia implements IProductMedia {
  constructor(public url: string) {}
}
