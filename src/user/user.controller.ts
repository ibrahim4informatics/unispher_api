import { Request, Response } from "express";
import { changeAvatarService, changeEmailService, changePasswordService, deleteUserService, getCurrentUserProfile, getUserById, getUsersService, uploadUserAvatarService } from "./user.service";
import { ChangeEmailDto } from "./user.dto";
import { profile } from "node:console";


const uploadUserAvatarController = async (req: Request, res: Response) => {
    const body = req.body;
    const file = req.file;

    await uploadUserAvatarService(body.user_id || undefined, file || undefined);
    return res.status(200).json({ message: "Profile picture uploaded successfully" });
}


const changeEmailController = async (req: Request, res: Response) => {
    const body = req.body as ChangeEmailDto;
    const user_id = req.user?.id || "";

    await changeEmailService(user_id, body.new_email);
    return res.status(200).json({ message: "Email changed successfully" });
}

const changePasswordController = async (req: Request, res: Response) => {
    const body = req.body;
    const user_id = req.user?.id || "";
    await changePasswordService(user_id, body.current_password, body.new_password);
    return res.status(200).json({ message: "Password changed successfully" });
}

const changeAvatarController = async (req: Request, res: Response) => {
    const file = req.file;
    const user_id = req.user?.id || "";
    await changeAvatarService(user_id, file || undefined);
    return res.status(200).json({ message: "Profile picture changed successfully" });

}

const deleteUserController = async (req: Request, res: Response) => {
    const user_id = req.user?.id || "";
    await deleteUserService(user_id);
    return res.status(200).json({ message: "User deleted successfully" });

}

const getProfileController = async (req: Request, res: Response) => {
    const user_id = req.user?.id || "";
    console.log(user_id)
    const user = await getCurrentUserProfile(user_id);
    return res.status(200).json({ profile: user });
}


const getUserByIdController = async (req: Request, res: Response) => {
    const current_user_id = req.user.id;
    const user_id = req.params.user_id as string;
    const user = await getUserById(user_id, current_user_id);

    return res.status(200).json({
        user
    })
}

const getUsersController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const query: { page?: number, role?: "STUDENT" | "TEACHER", name?: string } = req.query;
    const results = await getUsersService(query, user_id);
    return res.status(200).json(results)
}
export { changeEmailController, changePasswordController, changeAvatarController, uploadUserAvatarController, getUsersController, deleteUserController, getProfileController, getUserByIdController }

