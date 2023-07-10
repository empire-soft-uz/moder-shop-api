import mongoose, { Schema, Document, Model, model } from "mongoose";

interface prop {
  name: string;
  label: string;
  values: Array<string>;
}
interface PropDoc extends Document {
  name: string;
  label: string;
  values: Array<string>;
}
interface PropModel extends Model<PropDoc> {
  build(attrs: prop): PropDoc;
}

const propSchema = new Schema(
  {
    name: String,
    values: [String],
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
propSchema.statics.build = (attrs: prop): PropDoc => {
  return new Prop(attrs);
};
const Prop = model<PropDoc, PropModel>("Prop", propSchema);
export default Prop;
