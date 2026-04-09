import  { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { getMessagesByChatIdController, uploadAttachmentsController } from "./messages.controller";
import uploadMessageAttachment from "../midlewares/multer/uploadMessageAttachement";


const router = Router();

router.post("/chat/attachments", isAuthenticated,uploadMessageAttachment.single("file"), asyncHandler(uploadAttachmentsController));
router.get("/chat/:chat_id", isAuthenticated, asyncHandler(getMessagesByChatIdController));

export default router;