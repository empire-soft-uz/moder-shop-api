import { Model, Document, Schema, model } from "mongoose";
import IProduct from "../Interfaces/Product/IProduct";
import Product from "./Product";

interface user {
  fullName: string;
  password: string;
  phoneNumber: number;

  avatar: string;
  gender: string;
  birthdate: Date;
}
interface UserDoc extends Document {
  fullName: string;
  password: string;
  phoneNumber: number;

  avatar: string;
  gender: string;
  birthdate: Date;
  basket:IProduct[];
  online:boolean;
}
interface UserModel extends Model<UserDoc> {
  build(attrs: user): UserDoc;
}

const userSchema = new Schema(
  {
    fullName: String,
    password: String,
    phoneNumber: Number,
    avatar: String,
    gender: String,
    birthdate: Date,
    online:{type:Boolean, default:false},
    basket:[{type:Schema.Types.ObjectId, ref:Product}]
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
