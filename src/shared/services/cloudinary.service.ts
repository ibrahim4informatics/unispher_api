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

export function getPublicId(url: string) {
    const parts = url.split('/');
    const file = parts.slice(parts.indexOf('upload') + 2).join('/');
    return file.replace(/\.[^/.]+$/, '');
}

export function deleteFromCloudinary(public_id: string) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}


