import { Model, Schema, model, Document } from "mongoose";

interface category {
  name: string;
}
interface CategoryDoc extends Document {
  name: string;
}
interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: category): CategoryDoc;
}

const categorySchema = new Schema(
  {
    name: String,
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
