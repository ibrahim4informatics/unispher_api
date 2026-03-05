import cloudinary from "../../config/multer";
import streamfier from "streamifier";


export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        );

        streamfier.createReadStream(file.buffer).pipe(uploadStream);
    });
}


