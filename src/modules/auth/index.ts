import { Router } from "express";

import { useRoute } from "../../utils/error";
import { checkPhoneNumber, revalidateToken, verifyOtp } from "./controller";
import { checkAuth } from "../../middlewares/auth";

const authRouter = Router();

authRouter.post("/verify-otp", useRoute(verifyOtp));
authRouter.post("/check-phone-number", useRoute(checkPhoneNumber));
authRouter.get("/revalidate-token", checkAuth, useRoute(revalidateToken));

export default authRouter;
