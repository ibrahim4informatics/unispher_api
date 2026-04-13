import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { getModulesController } from "./modules.controllers";


const router = Router();


router.get("/", asyncHandler(getModulesController));

export default router;