import multer from 'multer';
import path from 'path';
import AppError from '../errors/AppError';
import status from 'http-status';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // We can use /tmp or a dedicated uploads folder. 
        // For now, let's use a local uploads folder (make sure to ignore it in git)
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new AppError(status.BAD_REQUEST as number, 'Only images (jpeg, jpg, png, webp) are allowed.'));
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
