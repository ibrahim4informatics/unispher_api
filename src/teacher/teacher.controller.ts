import { Request, Response } from "express";
import { type CreateTeacherProfileDto } from "./teacher.dto";
import { createTeacherProfileService } from "./teacher.service";

const createTeacherProfileController = async (req: Request, res: Response) => {
    const body: CreateTeacherProfileDto = req.body;
    const profile = await createTeacherProfileService(body);
    return res.status(201).json({ profile });
}


export {
    createTeacherProfileController
}