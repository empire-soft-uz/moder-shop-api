import { Model, Document } from "mongoose";
import IChat from "../Interfaces/IChat";
import IAdmin from "../Interfaces/IAdmin";
import IUser from "../Interfaces/IUser";
interface message {
    sender: string;
    reciever: string;
    chat: string;
    message: string;
    file: string;
    viewed: boolean;
}
interface MessageDoc extends Document {
    sender: IUser | IAdmin;
    reciever: IUser | IAdmin;
    chat: IChat;
    message: string;
    file: string;
    viewed: boolean;
}
interface MessageModel extends Model<MessageDoc> {
    build(attrs: message): MessageDoc;
}
declare const Message: MessageModel;
export default Message;
