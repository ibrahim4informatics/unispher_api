import z, { type ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

const validate = (schema: ZodType) =>  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)

    const validateResult =  schema.safeParse(req.body);

    if (validateResult.success) {
        next();
    } else {
        return res.status(400).json({ errors: z.treeifyError(validateResult.error) });
    }
}

export default validate;