import { Model, Document } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import IReview from "../Interfaces/Review/IReview";
import { IPropValue } from "../Interfaces/Product/IPropValue";
import IAdmin from "../Interfaces/IAdmin";
interface product {
    vendorId: IVendor["id"];
    name: string;
    description: string;
    author: string;
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
    author: IAdmin;
    price: Array<IPrice>;
    media: Array<IProductMedia> | undefined;
    props: Array<IPropValue>;
    likes: Array<string>;
    video: IProductMedia | undefined;
    reviews: Array<IReview>;
    viewCount: number;
}
interface ProductModel extends Model<ProductDoc> {
    build(attrs: product): ProductDoc;
    likeProduct(id: string, userId: string): Promise<ProductDoc | undefined>;
}
declare const Product: ProductModel;
export default Product;
