import { Model, Schema, model, Document } from "mongoose";
import Subcategory from "./Subcateygory";
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
const iconSchema = new Schema(
  {
    name: String,
    fileId: String,
  },
  { id: false, _id: false }
);
const categorySchema = new Schema(
  {
    name: String,
    icon: iconSchema,
    subcategories: { type: [Schema.Types.ObjectId], ref: "Subcategory" },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

categorySchema.statics.build = (attrs: category): CategoryDoc => {
  return new Category(attrs);
};
const Category = model<CategoryDoc, CategoryModel>("Category", categorySchema);
export default Category;
