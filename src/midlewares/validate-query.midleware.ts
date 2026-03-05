import z, { type ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

const validateQuery = (schema: ZodType) =>  (req: Request, res: Response, next: NextFunction) => {

    const validateResult =  schema.safeParse(req.query);

    if (validateResult.success) {
        next();
    } else {
        return res.status(400).json({ errors: z.treeifyError(validateResult.error) });
    }
}

export default validateQuery;