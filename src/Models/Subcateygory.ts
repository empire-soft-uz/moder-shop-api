import { Model, Schema, model, Document } from "mongoose";
import Prop from "./Prop";

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

const subcategorySchema = new Schema(
  {
    name: String,
    props: { type: [Schema.Types.ObjectId], ref: Prop },
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
