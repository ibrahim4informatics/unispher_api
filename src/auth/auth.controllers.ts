import { Request, Response } from "express";

const registerUser = async (request:Request, res:Response)=>{
    return res.status(200).json({message:"Registeration Route"})
}


export {
    registerUser
}