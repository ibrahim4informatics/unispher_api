import { Request, Response } from "express";
import { CreateStudentProfileDto, UpdateStudentProfileDto } from "./student.dto";
import { createStudentProfile, getStudentAcademicProfileService, updateStudentProfileService } from "./student.service";


export const createStudentProfileController = async (req: Request, res: Response) => {
    const createStudentProfileDto: CreateStudentProfileDto = req.body;
    const studentProfile = await createStudentProfile(createStudentProfileDto);
    return res.status(201).json({
        studentProfile
    });
}


export const updateStudentProfileController = async (req: Request, res: Response) => {

    const user_id = req.user.id;
    const data: UpdateStudentProfileDto = req.body;
    await updateStudentProfileService(data, user_id);
    return res.status(200).json({ message: "Profile Updated" });
}

export const getStudentAcademicProfileController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const profile = await getStudentAcademicProfileService(user_id);
    return res.status(200).json({ profile })
}
