import { Request, Response } from "express";
import { deleteEnrollmentService, enrollStudentService, getEnrolledCoursesService, getStudentEnrollmentService, getStudentsEnrolledByCourseId, unenrollStudentService } from "./enrollments.services";

export const enrollStudentController = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const user_id = req.user.id;
    const enrollment = await enrollStudentService(user_id, course_id as string);
    res.status(201).json({ enrollment });
}
export const unenrollStudentController = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const user_id = req.user.id;
    await unenrollStudentService(user_id, course_id as string);
    res.status(200).json({ message: "Unenrolled successfully" });
}

export const getEnrolledCoursesController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const courses = await getEnrolledCoursesService(user_id, page);
    res.status(200).json(courses);
}

export const getStudentEnrollmentController = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const user_id = req.user.id;
    const enrollment = await getStudentEnrollmentService(user_id, course_id as string);
    res.status(200).json({ enrollment });
}

export const getStudentsEnrolledByCourseIdController = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const user_id = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const students = await getStudentsEnrolledByCourseId(user_id, course_id as string, page);
    res.status(200).json(students);
}
export const deleteEnrollmentController = async (req: Request, res: Response) => {
    const { course_id, student_id } = req.params;
    const user_id = req.user.id;
    await deleteEnrollmentService(user_id, course_id as string, parseInt(student_id as string));
    return res.status(200).json({ message: "Enrollment deleted successfully" });
}