import { Router } from "express";

import { newMessage } from "./controller";
import { checkAuth } from "../../middlewares/auth";

const messageRouter = Router();

messageRouter.post("/new", checkAuth, newMessage);

export default messageRouter;
