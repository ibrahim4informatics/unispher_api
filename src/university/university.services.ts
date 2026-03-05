import db from "../config/db";
import { GetUniversitiesQuery } from "./university.dto";

const getUniversitiesService = async (getUniversitiesQuery: GetUniversitiesQuery) => {

    const universities = await db.university.findMany({
        where: {
            name: getUniversitiesQuery.name ? { contains: getUniversitiesQuery.name } : undefined,
            city:getUniversitiesQuery.city ? getUniversitiesQuery.city : undefined,
            short_name: getUniversitiesQuery.short_name ? {contains:getUniversitiesQuery.short_name} : undefined
        }
    });

    return universities;

}

export {getUniversitiesService}