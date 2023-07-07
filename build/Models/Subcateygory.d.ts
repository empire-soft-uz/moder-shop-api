import { Model, Document } from "mongoose";
interface subcategory {
    name: string;
    props: Array<string>;
}
interface SubcategoryDoc extends Document {
    name: string;
    props: Array<string>;
}
interface SubcategoryModel extends Model<SubcategoryDoc> {
    build(attrs: subcategory): SubcategoryDoc;
}
declare const Subcategory: SubcategoryModel;
export default Subcategory;
