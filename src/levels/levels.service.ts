import db from "../config/db";
import { GetLevelsQuery } from "./levels.dto";

const getLevels = async (query: GetLevelsQuery) => {

    const levels = await db.level.findMany({
        where: {
            name: query.name ? {
                contains: query.name
            } : undefined,
            field_id: query.field_id ? parseInt(query.field_id) : undefined,
        }
    });

    return levels;
}

export {
    getLevels
}