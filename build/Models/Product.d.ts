import { Model, Document } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import IReview from "../Interfaces/Review/IReview";
interface product {
    vendorId: IVendor["id"];
    name: string;
    description: string;
    category: string;
    subcategoty: string;
    price: Array<IPrice>;
    media: Array<IProductMedia> | undefined;
    props: Array<string>;
    video: IProductMedia | undefined;
    reviews: Array<IReview>;
}
interface ProductDoc extends Document {
    vendorId: IVendor["id"];
    name: string;
    category: string;
    subcategoty: string;
    description: string;
    price: Array<IPrice>;
    media: Array<IProductMedia> | undefined;
    props: Array<string>;
    video: IProductMedia | undefined;
    reviews: Array<IReview>;
    viewCount: number;
}
interface ProductModel extends Model<ProductDoc> {
    build(attrs: product): ProductDoc;
}
declare const Product: ProductModel;
export default Product;
