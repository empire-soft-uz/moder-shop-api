import { Model, Document } from "mongoose";
interface chat {
    user: string;
    admin: string;
}
interface ChatDoc extends Document {
    user: string;
    admin: string;
}
interface ChatModel extends Model<ChatDoc> {
    build(attrs: chat): ChatDoc;
}
declare const Chat: ChatModel;
export default Chat;
