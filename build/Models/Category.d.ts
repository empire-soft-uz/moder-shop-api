import { Model, Document } from "mongoose";
import IProductMedia from "../Interfaces/Product/IProducMedia";
interface category {
    name: string;
    icon?: IProductMedia;
}
interface CategoryDoc extends Document {
    name: string;
    subcategories: Array<string>;
    icon: IProductMedia;
}
interface CategoryModel extends Model<CategoryDoc> {
    build(attrs: category): CategoryDoc;
}
declare const Category: CategoryModel;
export default Category;
