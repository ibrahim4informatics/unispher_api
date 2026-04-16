import { Request, Response } from "express";
import { CreateSectionDto } from "./courses.dtos";
import { createSectionService, deleteSectionMaterialService, deleteSectionService, getCourseSectionsService, getSectionDetailsService, updateSectionService, uploadCourseMaterialService } from "./sections.services";

export const createSectionController = async (req: Request, res: Response) => {

    const { course_id } = req.params;
    const user_id = req.user.id;
    const data = req.body as CreateSectionDto;
    const files = req.files as Express.Multer.File[] || [];
    const section = await createSectionService(user_id, course_id as string, data, files);
    res.status(201).json({ section });
}

export const updateSectionController = async (req: Request, res: Response) => {

    const { course_id, section_id } = req.params;
    const user_id = req.user.id;
    const data = req.body as Partial<CreateSectionDto>;
    await updateSectionService(user_id, course_id as string, parseInt(section_id as string), data);
    res.status(200).json({ message: "Section updated successfully" });
}

export const deleteSectionController = async (req: Request, res: Response) => {
    const { course_id, section_id } = req.params;
    const user_id = req.user.id;
    await deleteSectionService(user_id, course_id as string, parseInt(section_id as string));
    res.status(200).json({ message: "Section deleted successfully" });
}

export const getCourseSectionsController = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const user_id = req.user.id;
    const sections = await getCourseSectionsService(user_id, course_id as string);
    res.status(200).json(sections);
}

export const getSectionDetailsController = async (req: Request, res: Response) => {
    const { course_id, section_id } = req.params;
    const user_id = req.user.id;
    const section = await getSectionDetailsService(user_id,course_id as string, parseInt(section_id as string));
    res.status(200).json({ section });
}


export const uploadSectionMaterialController = async (req: Request, res: Response) => {
    const { course_id, section_id } = req.params;
    const user_id = req.user.id;
    const files = req.files as Express.Multer.File[] || [];
    await uploadCourseMaterialService(user_id, course_id as string, parseInt(section_id as string), files);
    res.status(200).json({
        message: "Materials uploaded successfully"
    });
}

export const deleteSectionMaterialController = async (req: Request, res: Response) => {

    const { course_id, material_id } = req.params;
    const user_id = req.user.id;
    await deleteSectionMaterialService(user_id, course_id as string, parseInt(material_id as string));
    res.status(200).json({
        message: "Material deleted successfully"
    });
}
