import { Model, Document } from "mongoose";
import IProduct from "../Interfaces/Product/IProduct";
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
    basket: IProduct[];
    online: boolean;
}
interface UserModel extends Model<UserDoc> {
    build(attrs: user): UserDoc;
}
declare const User: UserModel;
export default User;
