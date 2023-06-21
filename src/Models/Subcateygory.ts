import { Model, Schema, model, Document } from "mongoose";

interface subcategory {
  categoryId: string;
  name: string;
}
interface SubcategoryDoc extends Document {
  categoryId: string;
  name: string;
}
interface SubcategoryModel extends Model<SubcategoryDoc> {
  build(attrs: subcategory): SubcategoryDoc;
}

const subcategorySchema = new Schema(
  {
    name: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
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

subcategorySchema.statics.build = (attrs: subcategory): SubcategoryDoc => {
  return new Subcategory(attrs);
};
const Subcategory = model<SubcategoryDoc, SubcategoryModel>(
  "Subcategory",
  subcategorySchema
);
export default Subcategory;
