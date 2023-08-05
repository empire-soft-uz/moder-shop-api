import { Model, Document } from "mongoose";
interface message {
    sender: string;
    reciever: string;
    chat: string;
    message: string;
    file: string;
}
interface MessageDoc extends Document {
    sender: string;
    reciever: string;
    chat: string;
    message: string;
    file: string;
}
interface MessageModel extends Model<MessageDoc> {
    build(attrs: message): MessageDoc;
}
declare const Message: MessageModel;
export default Message;
