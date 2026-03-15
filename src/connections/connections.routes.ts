import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { acceptConnectionRequestController, deleteConnectionController, getConncetionsController, getConnectionRequestsController, rejectConnectionRequestController, sendConnectionRequestController } from "./connections.controller";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetConnectionsRequestsQueryDto, SendConnectionRequestDto } from "./connections.dto";
import validate from "../midlewares/validate.midleware";
const router = Router();

router.post("/", isAuthenticated, validate(SendConnectionRequestDto), asyncHandler(sendConnectionRequestController));

router.get("/", isAuthenticated, validateQuery(GetConnectionsRequestsQueryDto), asyncHandler(getConncetionsController))
router.get("/requests", isAuthenticated, validateQuery(GetConnectionsRequestsQueryDto), asyncHandler(getConnectionRequestsController));

router.patch("/:connection_id/accept", isAuthenticated, asyncHandler(acceptConnectionRequestController));
router.delete("/:connection_id/reject", isAuthenticated, asyncHandler(rejectConnectionRequestController));
router.delete("/:connection_id/unconnect", isAuthenticated, asyncHandler(deleteConnectionController));
export default router;