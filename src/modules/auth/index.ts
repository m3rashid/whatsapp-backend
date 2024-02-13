import { Router } from "express";

import { useRoute } from "../../utils/error";
import { checkAuth } from "../../middlewares/auth";
import { checkPhoneNumber, validateLogin, verifyOtp } from "./controller";

const authRouter = Router();

authRouter.post("/verify-otp", useRoute(verifyOtp));
authRouter.post("/check-phone-number", useRoute(checkPhoneNumber));
authRouter.get("/validate-login", checkAuth, useRoute(validateLogin));

export default authRouter;
