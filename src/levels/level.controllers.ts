import { Request, Response } from "express";
import { GetLevelsQuery } from "./levels.dto";
import { getLevels } from "./levels.service";

const getLevelsController = async (req:Request, res:Response) => {
    const query:GetLevelsQuery = req.query;
    const levels = await getLevels(query);
    return res.status(200).json({
        levels
    })

}

export { getLevelsController }