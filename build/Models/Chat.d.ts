import { Model, Document } from "mongoose";
import IUser from "../Interfaces/IUser";
import IAdmin from "../Interfaces/IAdmin";
import IProduct from "../Interfaces/Product/IProduct";
interface chat {
    user: string;
    admin: string;
    product: string;
}
interface ChatDoc extends Document {
    user: IUser;
    admin: IAdmin;
    product: IProduct;
}
interface ChatModel extends Model<ChatDoc> {
    build(attrs: chat): ChatDoc;
}
declare const Chat: ChatModel;
export default Chat;
