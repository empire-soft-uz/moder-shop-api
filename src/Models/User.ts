import { Model, Document, Schema, model } from "mongoose";

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
