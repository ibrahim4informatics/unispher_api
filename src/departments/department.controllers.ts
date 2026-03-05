import { Request, Response } from "express";
import { GetDepartmentsQuery } from "./department.dto";
import { getDepartmentsService } from "./department.services";

const getDepartmentsController = async (req: Request, res: Response) => {
    const query: GetDepartmentsQuery = req.query;
    const departments = await getDepartmentsService(query);
    return res.status(200).json({departments});
}



export {
    getDepartmentsController
}