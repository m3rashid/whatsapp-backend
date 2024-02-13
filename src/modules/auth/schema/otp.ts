import mongoose from "mongoose";
import otpGenerator from "otp-generator";

export type Otp = {
  phone: string;
  code: string;
  createdAt: Date;
};

const otpSchema = new mongoose.Schema<Otp>({
  phone: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now() },
});

const OtpModel = mongoose.model<Otp>("Otp", otpSchema);
export default OtpModel;

/**
 * @description Generate a 6-digit numeric OTP and save it to the database
 *
 * Retries for { maxRetries = 5 } times to generate a unique OTP, may fail
 */
export async function generateOtp(phone: string, maxRetries = 3) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      const code = otpGenerator.generate(6, {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      });
      console.log("========== CODE ==========", { code });
      const _otp = new OtpModel({ phone, code: code });
      const otp = await _otp.save();
      return otp;
    } catch (err: any) {
      retryCount++;
      console.log(err);
      console.log("OTP Already Exists, Regenerating...");
    }
  }
}
