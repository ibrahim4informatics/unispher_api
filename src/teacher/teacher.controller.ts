import { Request, Response } from "express";
import { UpdateTeacherProfileDto, type CreateTeacherProfileDto } from "./teacher.dto";
import { createTeacherProfileService, getTeacherProfileService, updateTeacherProfileService } from "./teacher.service";

const createTeacherProfileController = async (req: Request, res: Response) => {
    const body: CreateTeacherProfileDto = req.body;
    const profile = await createTeacherProfileService(body);
    return res.status(201).json({ profile });
}
const getTeacherProfileController = async (req: Request, res: Response) => {
    const teacher_id = req.user?.id || "";
    const profile = await getTeacherProfileService(teacher_id);
    return res.status(200).json({ profile });
}
const updateTeacherProfileController = async (req: Request, res: Response) => {

    const teacher_id = req.user?.id || "";
    const body: UpdateTeacherProfileDto = req.body;
    await updateTeacherProfileService(teacher_id, body);
    return res.status(200).json({ message: "Teacher profile updated successfully" });
}
export {
    createTeacherProfileController,
    getTeacherProfileController,
    updateTeacherProfileController
}