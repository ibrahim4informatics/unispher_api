import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { createChatController, deleteChatController, getChatByIdController, getChatByUserIdController, getUserChatsController, updateLastReadAtController } from "./chats.controller";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { CreateChatDto } from "./chats.dto";


const router = Router();


router.post("/", isAuthenticated, validate(CreateChatDto), asyncHandler(createChatController));
router.get("/", isAuthenticated, asyncHandler(getUserChatsController));
router.get("/user/:user_id", isAuthenticated, asyncHandler(getChatByUserIdController));
router.patch("/last_read_at/:chat_id", isAuthenticated, asyncHandler(updateLastReadAtController));
router.get("/:chat_id", isAuthenticated, asyncHandler(getChatByIdController));
router.delete("/:chat_id", isAuthenticated, asyncHandler(deleteChatController));


export default router;