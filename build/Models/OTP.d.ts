import { Document, Model } from "mongoose";
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
declare const OTP: OTPModel;
export default OTP;
