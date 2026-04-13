import db from "../config/db"

export const getModulesService = async (params: { page?: string, field_id?: string, level_id?: string, code?: string, name?: string }) => {
    const modules = await db.module.findMany({
        where: {
            name: params.name ? { contains: params.name } : undefined,
            code: params.code ? { contains: params.code } : undefined,
            fields: params.field_id ? { some: { id: parseInt(params.field_id) } } : undefined,
            levels: params.level_id ? { some: { id: parseInt(params.level_id) } } : undefined,

        }
    });

    return modules;
} 