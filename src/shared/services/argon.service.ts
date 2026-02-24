import argon2 from "argon2";
import { AppError } from "../errors/AppError";


const hash = async (value: string): Promise<string> => {
    try {
        const hash = await argon2.hash(value);
        return hash;
    }
    catch (err) {
        console.log(`Argon2 Hash Error:${err}`)
        throw new AppError("Can not register user", 501)
    }
}

const verify = async (value:string,hash:string):Promise<boolean> => {
    try {
        const isVerified = await argon2.verify(hash, value);
        return isVerified;
    }

    catch (err) {
        console.log(`Argon2 Verify Error:${err}`)
        throw new AppError("Can not login user", 501)
    }
}


export {
    verify, hash
}