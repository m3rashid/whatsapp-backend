//////////////////////////////////////////////////////////////////////////
// 	Story																																//
// 	1. User enters phone number in the input box and clicks get started //
//  2. The server sends a verification code to the user's phone number 	//
//		- This code is valid for 5 minutes																//
// 	3. The user enters the verification code and clicks verify					//
//  4. The server verifies the code and sends a JWT token to the user		//
//////////////////////////////////////////////////////////////////////////

import { z } from "zod";
import type { Request, Response } from "express";

import UserModel from "./schema/user";
import { issueJWT } from "../../utils/jwt";
import OtpModel, { generateOtp } from "./schema/otp";
import {
  type IdempotentResponse,
  setIdempotencyKeyValue,
} from "../../utils/idempotency";

const checkPhoneNumberSchema = z.object({ phone: z.string() }).strict();
export async function checkPhoneNumber(
  req: Request<any, any, z.infer<typeof checkPhoneNumberSchema>>,
  res: Response<{ message: string }>
) {
  checkPhoneNumberSchema.parse(req.body);
  const otp = await generateOtp(req.body.phone);
  if (!otp) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  // !TODO send otp code to user
  req.log.info("OTP Generated", { otp: otp.code, phone: otp.phone });

  return res.status(200).json({ message: "OTP Sent" });
}

const verifyOtpSchema = z
  .object({ phone: z.string(), code: z.string().length(6) })
  .strict();
export async function verifyOtp(
  req: Request<any, any, z.infer<typeof verifyOtpSchema>>,
  res: Response
) {
  verifyOtpSchema.parse(req.body);
  const deleteOtp = await OtpModel.deleteOne({
    phone: req.body.phone,
    code: req.body.code,
  });

  if (deleteOtp.deletedCount === 0) {
    return res.status(400).json({ message: "Invalid OTP Code" });
  }

  let user = await UserModel.findOne({ phone: req });
  if (!user) {
    const newUser = new UserModel({ phone: req.body.phone });
    user = await newUser.save();
  }

  return res.status(200).json({
    user,
    message: "OTP Verified",
    token: issueJWT(user._id as any).token,
  });
}

export async function validateLogin(req: Request, res: Response) {
  if (!req.isAuthenticated || !req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const cacheResponse: IdempotentResponse = {
    code: 200,
    json: {
      user,
      message: "Token Revalidated",
      token: issueJWT(user._id as any).token,
    },
  };

  await setIdempotencyKeyValue(req.idempotentKey, cacheResponse);
  return res.status(cacheResponse.code).json(cacheResponse.json);
}
