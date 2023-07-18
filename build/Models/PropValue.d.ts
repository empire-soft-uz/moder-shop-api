import { Document, Model } from "mongoose";
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
declare const PropValue: PropValueModel;
export default PropValue;
