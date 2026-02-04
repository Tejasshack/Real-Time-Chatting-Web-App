import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { response, type Request, type Response } from "express";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../model/User.js";
import { generateToken } from "../config/generateToken.js";

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Users fetched successfully",
  });
};

export const loginUser = TryCatch(async (req, res) => {
  if (!req.body?.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // 🔥 NORMALIZE EMAIL (CRITICAL)
  let email: string = req.body.email.toLowerCase().trim();

  const rateLimitKey = `otp:ratelimit:${email}`;

  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    return res.status(429).json({
      message: "Too many requests, please wait before requesting new OTP",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, otp, { EX: 300 });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  const message = {
    to: email,
    subject: "Your OTP Code – TejasChatApp",
    body: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="padding:24px 32px;border-bottom:1px solid #eaeaea;">
                  <h2 style="margin:0;color:#222;">TejasChatApp</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="font-size:16px;color:#333;margin:0 0 16px;">
                    Hi,
                  </p>

                  <p style="font-size:15px;color:#555;margin:0 0 24px;">
                    Use the OTP below to complete your login. This OTP is valid for
                    <strong>5 minutes</strong>.
                  </p>

                  <div style="text-align:center;margin:32px 0;">
                    <span style="
                      display:inline-block;
                      padding:14px 28px;
                      font-size:28px;
                      letter-spacing:6px;
                      background:#f1f5ff;
                      color:#1a3cff;
                      border-radius:6px;
                      font-weight:bold;
                    ">
                      ${otp}
                    </span>
                  </div>

                  <p style="font-size:14px;color:#777;margin:0 0 8px;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>

                  <p style="font-size:14px;color:#777;margin:0;">
                    For security reasons, never share this OTP with anyone.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px;border-top:1px solid #eaeaea;font-size:12px;color:#999;">
                  © ${new Date().getFullYear()} TejasChatApp. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "OTP delivered to your email",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  let { email, otp: enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    return res.status(400).json({
      message: "Email and OTP Required",
    });
  }

  email = email.toLowerCase().trim();
  const normalizedOtp = String(enteredOtp);

  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== normalizedOtp) {
    return res.status(400).json({
      message: "Invalid or Expired OTP",
    });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: email.split("@")[0],
      email,
    });
  }

  const token = generateToken({
    id: user._id.toString(),
    email: String(user.email),
  });

  res.json({
    message: "User Verified",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    return res.status(404).json({
      message: "Please Login",
    });
  }

  user.name = req.body.name;
  await user.save();

  const token = generateToken({
    id: user._id.toString(),
    email: String(user.email),
  });

  res.json({
    message: "User Updated Successfully",
    user,
    token,
  });
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
  const users = await User.find();
  res.json(users);
});

export const getUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
