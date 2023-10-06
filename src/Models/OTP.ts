import { Document, Model, Schema, model } from "mongoose";

interface otp {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  isVerified: Boolean;
}
interface OTPDoc extends Document {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  isVerified: Boolean;
}
interface OTPModel extends Model<OTPDoc> {
  build(attrs: otp): OTPDoc;
}
const otpSchema = new Schema(
  {
    phoneNumber: { type: String, unique: true },
    code: String,
    expiresAt: Date,
    isVerified: { type: Boolean, default: false },
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
otpSchema.statics.build = (attrs: otp): OTPDoc => new OTP(attrs);
const OTP = model<OTPDoc, OTPModel>("OTP", otpSchema);
export default OTP;
