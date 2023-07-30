import { Model, Document } from "mongoose";
import IProductMedia from "../Interfaces/Product/IProducMedia";
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
declare const Slider: SliderModel;
export default Slider;
