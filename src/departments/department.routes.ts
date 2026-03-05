import { Router } from "express";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetDepartmentsQuerySchema } from "./department.dto";
import { asyncHandler } from "../shared/asyncHandler";
import { getDepartmentsController } from "./department.controllers";


const router = Router();


router.get("/", validateQuery(GetDepartmentsQuerySchema), asyncHandler(getDepartmentsController));

export default router;