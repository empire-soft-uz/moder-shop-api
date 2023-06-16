import { Model, Document, Schema, model } from "mongoose";
import IUser from "../Interfaces/IUser";
import Password from "../utils/Password";
interface user {
  fullName: string;
  password: string;
  phoneNumber: number;
  email: string;
  avatar: string;
  gender: string;
  berthdate: Date;
}
interface UserDoc extends Document {
  fullName: string;
  password: string;
  phoneNumber: number;
  email: string;
  avatar: string;
  gender: string;
  berthdate: Date;
}
interface UserModel extends Model<UserDoc> {
  build(attrs: user): UserDoc;
}

const userSchema = new Schema(
  {
    fullName: String,
    password: String,
    phoneNumber: Number,
    email: String,
    avatar: String,
    gender: String,
    berthdate: Date,
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

userSchema.statics.build = (attrs: user): UserDoc => {
  return new User(attrs);
};
const User = model<UserDoc, UserModel>("User", userSchema);

export default User;
