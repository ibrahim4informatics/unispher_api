import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { getFieldsController } from "./field.controllers";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetFieldQuerySchema } from "./field.dto";

const router = Router();

router.get("/", validateQuery(GetFieldQuerySchema), asyncHandler(getFieldsController));


export default router;