import { User } from "@prisma/client";
import { UserRegisterBody } from "./auth.dto";
import db from "../config/db";
import { NotFoundError } from "../shared/errors/NotFoundError";

const registerUserService = async (data: UserRegisterBody):Promise<User|null> => {

    // const {student_id, email, password, first_name, last_name, bio, role} = data;

    // if(role === "TEACHER"){
    //     const teacher = await db.user.findUnique({where:{email}});
    //     if(teacher) return null;
    // }

    // else {

    // }
    
    // return null

    console.log(data);
    throw new NotFoundError("this is test");
}

export {
    registerUserService
}