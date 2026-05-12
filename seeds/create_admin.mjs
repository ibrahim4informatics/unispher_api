import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";


const prisma = new PrismaClient();

export  async function createAdmin(){
    await prisma.user.create({
        data:{
            email:"admin@test.com",
            first_name:"Admin",
            last_name:"Admin",

            password:await hash("admin"),
            role:"ADMIN",
            admin_profile:{
                create:{
                    admin_type:"SUPER_ADMIN",
                    login_fails_count:0,
                    
                }
            }
        }
    })
}