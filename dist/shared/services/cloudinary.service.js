"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderFromUrl = exports.uploadToCloudinary = void 0;
exports.getPublicId = getPublicId;
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.getSignedUrl = getSignedUrl;
const multer_1 = __importDefault(require("../../config/multer"));
const streamifier_1 = __importDefault(require("streamifier"));
const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = multer_1.default.uploader.upload_stream({
            folder,
            access_mode: "public",
            resource_type: file.mimetype.startsWith("video/") ? "video" : file.mimetype.startsWith("image/") ? "image" : "raw"
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result?.secure_url || "");
            }
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
function getPublicId(url) {
    const parts = url.split('/');
    const file = parts.slice(parts.indexOf('upload') + 2).join('/');
    return file.replace(/\.[^/.]+$/, '');
}
function deleteFromCloudinary(public_id, type = "raw") {
    return new Promise((resolve, reject) => {
        multer_1.default.uploader.destroy(public_id, {
            resource_type: type,
            invalidate: true
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
const getFolderFromUrl = (url) => {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
        throw new Error("Invalid Cloudinary URL");
    }
    return parts[uploadIndex + 1];
};
exports.getFolderFromUrl = getFolderFromUrl;
function getSignedUrl(folder, public_id) {
    return multer_1.default.url(`${folder}/${public_id}`, {
        sign_url: true,
        secure: true
    });
}
