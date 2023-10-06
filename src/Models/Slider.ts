import { Model, Schema, model, Document } from "mongoose";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import Vendor from "./Vendor";
import Product from "./Product";
interface slider {
  image: IProductMedia;
  title: string;
  descriptionn: string;
  productId: string;
  vendorId: string;
}
interface SliderDoc extends Document {
  image: IProductMedia;
  title: string;
  descriptionn: string;
  productId: string;
  vendorId: string;
}
interface SliderModel extends Model<SliderDoc> {
  build(attrs: slider): SliderDoc;
}

const mediaSchema = new Schema(
  {
    name: String,
    fileId: String,
  },
  { id: false, _id: false }
);
const sliderSchema = new Schema(
  {
    image: mediaSchema,
    title: String,
    descriptionn: String,
    productId: { type: Schema.Types.ObjectId, ref: Product },
    vendorId: { type: Schema.Types.ObjectId, ref: Vendor },
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

sliderSchema.statics.build = (attrs: slider): SliderDoc => {
  return new Slider(attrs);
};
const Slider = model<SliderDoc, SliderModel>("Slider", sliderSchema);
export default Slider;
