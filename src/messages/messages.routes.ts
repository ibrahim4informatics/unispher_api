import  { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { getMessagesByChatIdController } from "./messages.controller";


const router = Router();

router.get("/chat/:chat_id", isAuthenticated, asyncHandler(getMessagesByChatIdController));

export default router;