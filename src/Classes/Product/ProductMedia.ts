import IProductMedia from "../../Interfaces/Product/IProducMedia";

export default class ProductMedia implements IProductMedia {
  constructor(public name: string, public fileId: string) {}
}
