import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { getFacultiesController } from "./faculty.controllers";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetFacultiesQuerySchema } from "./faculty.dto";

const router = Router();

router.get("/", validateQuery(GetFacultiesQuerySchema), asyncHandler(getFacultiesController));

export default router;