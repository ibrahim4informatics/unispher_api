import { Request, Response } from "express";
import { CreateStudentProfileDto } from "./student.dto";
import { createStudentProfile } from "./student.service";


const createStudentProfileController = async (req: Request, res: Response) => {
    const createStudentProfileDto: CreateStudentProfileDto = req.body;
    const studentProfile = await createStudentProfile(createStudentProfileDto);
    return res.status(201).json({
        studentProfile
    });
}





export { createStudentProfileController }