import JWT from "jsonwebtoken";

import env from "./env";

export const issueJWT = (userId: string) => {
  const expiresIn = "1d";
  const payload: JWT.JwtPayload = {
    sub: userId,
    iat: Date.now(),
  };

  return {
    expires: expiresIn,
    token: JWT.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: expiresIn,
    }),
  };
};

export const verifyJWT = (token: string) => {
  try {
    const extractedToken = token.split(" ")[1];
    if (!extractedToken) throw new Error("Invalid Token");
    const decoded = JWT.verify(extractedToken, env.JWT_ACCESS_SECRET);
    return {
      valid: true,
      expired: false,
      payload: decoded,
    };
  } catch (err: any) {
    console.log(err);
    return {
      valid: false,
      payload: null,
      expired: err.message === "jwt expired",
    };
  }
};
