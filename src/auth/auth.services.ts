import { User } from "@prisma/client";
import { UserRegisterBody } from "./auth.dto";
import db from "../config/db";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { BadRequestError } from "../shared/errors/BadRequestError";

const registerUserService = async (data: UserRegisterBody):Promise<User|null> => {

    const {student_id, email, password, first_name, last_name, bio, role} = data;

    if(role === "TEACHER"){
        const teacher = await db.user.findUnique({where:{email}});
        if(teacher) throw new BadRequestError("the email is taken");
    }

    else {

    }
    
    return null

    console.log(data);
}

export {
    registerUserService
}