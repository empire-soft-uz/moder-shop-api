import mongoose, { Schema, Document, Model, model } from "mongoose";
import PropValue from "./PropValue";
import Product from "./Product";

interface prop {
  name: string;
  label: string;
}
interface PropDoc extends Document {
  name: string;
  label: string;
}
interface PropModel extends Model<PropDoc> {
  build(attrs: prop): PropDoc;
}

const propSchema = new Schema(
  {
    name: { type: String, unique: true },
    label: String,
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
propSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const values = await PropValue.find({
      prop: doc._id,
    }).distinct("_id");
    const res = await Promise.all([
      PropValue.find({
        prop: doc._id,
      }).distinct("_id"),
      PropValue.deleteMany({prop: doc._id,})
    ]);
    
    const delProduct=await Product.deleteMany({props:{$in:res[0]}})
    console.log(delProduct);
  }
});
propSchema.statics.build = (attrs: prop): PropDoc => {
  return new Prop(attrs);
};
const Prop = model<PropDoc, PropModel>("Prop", propSchema);
export default Prop;
