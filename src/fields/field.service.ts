import db from "../config/db";
import { GetFieldQuery } from "./field.dto";

const getFieldsService = async (queryParams: GetFieldQuery) => {

    const fields = await db.field.findMany({
        where: {
            name: queryParams.name ? {
                contains: queryParams.name
            } : undefined,
            department_id: queryParams.department_id ? parseInt(queryParams.department_id) : undefined,
        }

    });

    return fields;
}

export {
    getFieldsService
}