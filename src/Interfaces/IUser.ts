import mongoose from "mongoose";

export default interface IUser {
  id: string;
  fullName: string;
  password: string;
  phoneNumber: number;
  email: string;
  avatar: string;
  gender: string;
  berthdate: Date;
}
