import { Router } from "express";


import { getLevelsController } from "./level.controllers";
import validateQuery from "../midlewares/validate-query.midleware";
import { GetLevelsQuerySchema } from "./levels.dto";

const router = Router();

router.get("/", validateQuery(GetLevelsQuerySchema), getLevelsController);

export default router;