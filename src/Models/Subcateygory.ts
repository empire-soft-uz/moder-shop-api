import { Model, Schema, model, Document } from "mongoose";
import Prop from "./Prop";
import PropValue from "./PropValue";
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

const subcategorySchema = new Schema(
  {
    name: String,
    props: { type: [Schema.Types.ObjectId], ref: PropValue },
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
subcategorySchema.statics.removePropValues = (vals: { id: string }[]) => {};
const Subcategory = model<SubcategoryDoc, SubcategoryModel>(
  "Subcategory",
  subcategorySchema
);
export default Subcategory;
