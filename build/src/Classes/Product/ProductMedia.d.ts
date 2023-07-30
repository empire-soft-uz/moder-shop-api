import IProductMedia from "../../Interfaces/Product/IProducMedia";
export default class ProductMedia implements IProductMedia {
    name: string;
    fileId: string;
    constructor(name: string, fileId: string);
}
