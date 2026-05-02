import { Request, Response } from "express";
import { CreateCourseDto, GetCourseQuery } from "./courses.dtos";
import { createCourseService, deleteOwnCourseService, getCourseDetailsService, getCoursesService, getOwnCourseDetailsService, getOwnCoursesService, updateCourseService } from "./courses.services";

export const createCourseController = async (req: Request, res: Response) => {
    const data = req.body as CreateCourseDto;
    const user_id = req.user.id;
    const course = await createCourseService(user_id, data);
    return res.status(201).json({
        course
    })
}


export const getCoursesController = async (req: Request, res: Response) => {
    const query = req.query as GetCourseQuery;
    const user_id = req.user.id;
    const coursesData = await getCoursesService(user_id, query);
    return res.status(200).json(coursesData);
}

export const getOwnCoursesController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const query = req.query as GetCourseQuery;
    const coursesData = await getOwnCoursesService(user_id, query);
    return res.status(200).json(coursesData);
}

export const getCourseDetailsController = async (req: Request, res: Response) => {
    const course_id = req.params.course_id as string;
    const user_id = req.user.id;
    const course = await getCourseDetailsService(course_id, user_id);
    return res.status(200).json(course);
}

export const updateCourseController = async (req: Request, res: Response) => {
    const course_id = req.params.course_id as string;
    const user_id = req.user.id;
    const data = req.body as Partial<CreateCourseDto>;
    await updateCourseService(user_id, course_id, data);
    return res.status(200).json({ message: "Course updated successfully" });
}


export const getOwnCourseDetailsController = async (req: Request, res: Response) => {
    const course_id = req.params.course_id as string;
    const user_id = req.user.id;
    const course = await getOwnCourseDetailsService(user_id, course_id);
    return res.status(200).json({ course });
}

export const deleteOwnCourseController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const course_id = req.query.course_id as string;

    console.log('first')

    await deleteOwnCourseService(user_id, course_id);
    return res.status(200).json({ messsage: "Course deleted successfully" });
}