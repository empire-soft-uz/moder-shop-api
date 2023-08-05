import { Model, Schema, model, Document } from "mongoose";
import User from "./User";
import Admin from "./Admin";

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

const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, reg: User },
    admin: { type: Schema.Types.ObjectId, reg: Admin },
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

messageSchema.statics.build = (attrs: message): ChatDoc => {
  return new Chat(attrs);
};
const Chat = model<ChatDoc, ChatModel>("Chat", ChatSchema);
export default Chat;
