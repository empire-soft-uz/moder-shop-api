import { Document, Model } from "mongoose";
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
declare const Prop: PropModel;
export default Prop;
