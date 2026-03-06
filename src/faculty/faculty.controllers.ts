import { Request, Response } from "express";
import { GetFacultiesQuery } from "./faculty.dto";
import { getFacultiesService } from "./faculty.service";

const getFacultiesController = async (req:Request, res:Response) => {

    const query:GetFacultiesQuery = req.query;
    const faculties = await getFacultiesService(query);
    return res.status(200).json({faculties});
}

export {getFacultiesController}