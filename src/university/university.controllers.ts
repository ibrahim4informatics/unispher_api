import { Request, Response } from "express";
import { GetUniversitiesQuery } from "./university.dto";
import { getUniversitiesService } from "./university.services";

const getUniversitiesController = async (req: Request, res: Response) => {
    const query: GetUniversitiesQuery = req.query;
    const universities = await getUniversitiesService(query);
    return res.status(200).json({ universities });
}


export { getUniversitiesController }