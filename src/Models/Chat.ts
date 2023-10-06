import { Model, Schema, model, Document } from "mongoose";
import User from "./User";
import Admin from "./Admin";
import IUser from "../Interfaces/IUser";
import IAdmin from "../Interfaces/IAdmin";
import IProduct from "../Interfaces/Product/IProduct";
import Product from "./Product";

interface chat {
  user: string;
  admin: string;
  product:string
}
interface ChatDoc extends Document {
  user: IUser;
  admin: IAdmin;
  product:IProduct  
}
interface ChatModel extends Model<ChatDoc> {
  build(attrs: chat): ChatDoc;
}

const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: User },
    admin: { type: Schema.Types.ObjectId, ref: Admin },
    product: { type: Schema.Types.ObjectId, ref: Product },

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

chatSchema.statics.build = (attrs: chat): ChatDoc => {
  return new Chat(attrs);
};
const Chat = model<ChatDoc, ChatModel>("Chat", chatSchema);
export default Chat;
