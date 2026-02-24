import { Prisma, User } from "@prisma/client";
import { UserRegisterBody } from "./auth.dto";
import db from "../config/db";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { hash } from "../shared/services/argon.service";

const registerUserService = async (data: UserRegisterBody): Promise<Omit<User, "password" | "avatar_url" | "student_id">> => {

    const { student_id, email, password, first_name, last_name, bio, role = "STUDENT" } = data;

    const hashPassword = await hash(password);
    if (role === "TEACHER") {
        const teacher = await db.user.findUnique({ where: { email } });
        if (teacher) throw new BadRequestError("the email is taken");
        const { avatar_url, student_id, password, ...newTeacher } = await db.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword } });
        return newTeacher;
    }
    else {
        const student = await db.user.findFirst({ where: { OR: [{ student_id }, { email }] } });
        if (student) throw new BadRequestError("Student with this credentials already exist");
        const { avatar_url, password, ...newStudent } = await db.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword, student_id } });
        return newStudent;
    }
}

export {
    registerUserService
}