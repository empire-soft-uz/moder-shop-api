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
  { id: false, _id: false }
);
const Prop = model<PropDoc, PropModel>("Prop", propSchema);
export default Prop;
