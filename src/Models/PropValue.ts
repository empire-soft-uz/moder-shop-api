import mongoose, { Schema, Document, Model, model } from "mongoose";
import Prop from "./Prop";
import { NextFunction } from "express";
interface propValue {
  prop: string;
  value: string;
}
interface PropValueDoc extends Document {
  prop: string;
  value: string;
}
interface PropValueModel extends Model<PropValueDoc> {
  build(attrs: propValue): PropValueDoc;
}

const propValueSchema = new Schema(
  {
    value: { type: String, unique: true },
    prop: { type: Schema.Types.ObjectId, ref: Prop },
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

propValueSchema.statics.build = (attrs: propValue): PropValueDoc => {
  return new PropValue(attrs);
};
const PropValue = model<PropValueDoc, PropValueModel>(
  "PropValue",
  propValueSchema
);
export default PropValue;
