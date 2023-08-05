import { Model, Schema, model, Document } from "mongoose";

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

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, reg: User },
    reciever: { type: Schema.Types.ObjectId, required: true, reg: User },
    chat: { type: Schema.Types.ObjectId, required: true, reg: Chat },
    message: String,
    file: String,
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
