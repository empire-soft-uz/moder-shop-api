import mongoose from "mongoose";

export default interface IUser {
  //id: mongoose.Types.ObjectId;
  fullName: string;
  password: string;
  phoneNumber: number;
  email: string;
  avatar: string;
  gender: string;
  berthdate: Date;
}
