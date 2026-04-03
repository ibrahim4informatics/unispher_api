import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { createChatController, deleteChatController, getUserChatsController } from "./chats.controller";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { CreateChatDto } from "./chats.dto";


const router = Router();


router.post("/", isAuthenticated, validate(CreateChatDto), asyncHandler(createChatController));


router.get("/", isAuthenticated, asyncHandler(getUserChatsController));
router.delete("/:chat_id", isAuthenticated, asyncHandler(deleteChatController));


export default router;