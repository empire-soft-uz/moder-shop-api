import mongoose, { Schema, Document, Model, model } from "mongoose";
interface option {
  label: string;
  value: string;
}
interface prop {
  type: string;
  options: option[];
}
interface PropDoc extends Document {
  type: string;
  options: option[];
}
interface PropModel extends Model<PropDoc> {
  build(attrs: prop): PropDoc;
}
const optionSchema = new Schema(
  {
    label: String,
    value: String,
  },
  { id: false, _id: false }
);
const propSchema = new Schema(
  {
    type: String,
    options: [optionSchema],
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
