import { Request, Response } from "express";
import { uploadUserAvatarService } from "./user.service";


const uploadUserAvatarController = async (req: Request, res: Response) => {
    const body= req.body;
    const file = req.file;

    await uploadUserAvatarService(body.user_id || undefined, file || undefined);
    return res.status(200).json({ message: "Profile picture uploaded successfully" });
}

export { uploadUserAvatarController }