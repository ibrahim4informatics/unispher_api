import { UserRoles } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import db from "../../config/db";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../../shared/errors/ForbidenError";

const hasRoleOf = (roles: UserRoles[]) => (
    async (req: Request, res: Response, next: NextFunction) => {

        const user = await db.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                role: true
            }
        });
        if (!user) throw new UnauthorizedError("User not authorized");
        if (!roles.includes(user.role)) throw new ForbiddenError("User has no access for this action");
        next()
    }
)

export default hasRoleOf;