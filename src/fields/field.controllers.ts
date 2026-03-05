import { Request, Response } from "express";
import { getFieldsService } from "./field.service";
import { GetFieldQuery } from "./field.dto";

const getFieldsController = async (req: Request, res: Response) => {
    const query: GetFieldQuery = req.query;
    const fields = await getFieldsService(query);
    return res.status(200).json({
        fields
    })

}


export { getFieldsController }