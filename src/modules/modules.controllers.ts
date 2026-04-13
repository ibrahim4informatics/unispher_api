import { Request, Response } from "express";
import { getModulesService } from "./modules.services";


export const getModulesController = async (req: Request, res: Response) => {

    const query = req.query as { page?: string, field_id?: string, level_id?: string, code?: string, name?: string };
    const modules = await getModulesService(query);
    return res.status(200).json({ modules });
}