import cloudinary from "../../config/multer";
import streamfier from "streamifier";


export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                access_mode: "public",
                resource_type: file.mimetype.startsWith("video/") ? "video" : file.mimetype.startsWith("image/") ? "image" : "raw"
            },
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

export function deleteFromCloudinary(public_id: string, type: "image" | "video" | "raw" = "raw") {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, {
            resource_type: type,
            invalidate: true
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export const getFolderFromUrl = (url: string) => {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
        throw new Error("Invalid Cloudinary URL");
    }
    return parts[uploadIndex + 1];
}

export function getSignedUrl(folder: string, public_id: string) {
    return cloudinary.url(`${folder}/${public_id}`, {
        sign_url: true,
        secure: true
    });
}


