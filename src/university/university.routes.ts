import { Router } from "express";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetUniversitiesQuerySchema } from "./university.dto";
import { asyncHandler } from "../shared/asyncHandler";
import { getUniversitiesController } from "./university.controllers";


const router = Router();


router.get("/", validateQuery(GetUniversitiesQuerySchema), asyncHandler(getUniversitiesController));

export default router;