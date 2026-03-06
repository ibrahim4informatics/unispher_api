import db from "../config/db";
import { GetFacultiesQuery } from "./faculty.dto";


const getFacultiesService = async (query:GetFacultiesQuery) => {

    const faculties = await db.faculty.findMany({
        where: {
            university_id: query.university_id ? query.university_id : undefined,
            name: query.name ? { contains: query.name } : undefined
        }
    });

    return faculties;

}

export {getFacultiesService}