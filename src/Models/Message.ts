import { Model, Schema, model, Document } from "mongoose";
import User from "./User";
import Chat from "./Chat";
import IChat from "../Interfaces/IChat";
import IAdmin from "../Interfaces/IAdmin";
import IUser from "../Interfaces/IUser";

interface message {
  sender: string;
  reciever: string;
  chat: string;
  message: string;
  file: string;
  viewed:boolean
}
interface MessageDoc extends Document {
  sender: IUser|IAdmin;
  reciever: IUser|IAdmin;
  chat: IChat;
  message: string;
  file: string;
  viewed:boolean
}
interface MessageModel extends Model<MessageDoc> {
  build(attrs: message): MessageDoc;
}

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: User },
    reciever: { type: Schema.Types.ObjectId, required: true, ref: User },
    chat: { type: Schema.Types.ObjectId, required: true, ref: Chat },
    message: String,
    file: String,
    viewed:{type:Boolean, default:false}
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

messageSchema.statics.build = (attrs: message): MessageDoc => {
  return new Message(attrs);
};
const Message = model<MessageDoc, MessageModel>("Message", messageSchema);
export default Message;
