import { Model, Document } from "mongoose";
import { IPropValue } from "../Interfaces/Product/IPropValue";
interface subcategory {
    name: string;
    props: Array<string>;
}
interface SubcategoryDoc extends Document {
    name: string;
    props: Array<IPropValue>;
}
interface SubcategoryModel extends Model<SubcategoryDoc> {
    build(attrs: subcategory): SubcategoryDoc;
}
declare const Subcategory: SubcategoryModel;
export default Subcategory;
