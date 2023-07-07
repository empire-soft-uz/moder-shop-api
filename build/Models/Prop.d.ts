import { Document, Model } from "mongoose";
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
declare const Prop: PropModel;
export default Prop;
