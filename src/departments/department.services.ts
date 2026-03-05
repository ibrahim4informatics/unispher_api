import db from "../config/db";
import { GetDepartmentsQuery } from "./department.dto";


const getDepartmentsService = async (getDepartmentsQuery: GetDepartmentsQuery) => {

    const departments = await db.department.findMany({
        where: {
            name: getDepartmentsQuery.name ? { contains: getDepartmentsQuery.name } : undefined,
            university_id: getDepartmentsQuery.university_id ? getDepartmentsQuery.university_id : undefined,
            faculty_id: getDepartmentsQuery.faculty_id ? parseInt(getDepartmentsQuery.faculty_id) : undefined,
        }
    });

    return departments;
}


export {
    getDepartmentsService
}