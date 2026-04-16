import multer from "multer";

const storage = multer.memoryStorage();

const uploadCourseMaterials = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 },
    
})

export default uploadCourseMaterials;