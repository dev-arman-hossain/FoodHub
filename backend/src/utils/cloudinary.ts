import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../config/env';
import AppError from '../errors/AppError';
import status from 'http-status';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.API_KEY,
    api_secret: envVars.CLOUDINARY.API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param filePath Path to the local file (usually from multer)
 * @param folder Cloudinary folder name
 */
const uploadImage = async (filePath: string, folder: string): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `foodhub/${folder}`,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
        });
        return result.secure_url;
    } catch (error) {
        throw new AppError(status.INTERNAL_SERVER_ERROR as number, 'Failed to upload image to Cloudinary.');
    }
};

/**
 * Delete an image from Cloudinary
 * @param imageUrl Full secure URL of the image
 */
const deleteImageByUrl = async (imageUrl: string): Promise<void> => {
    try {
        // Extract public_id from URL: http://res.cloudinary.com/cloud_name/image/upload/v12345678/folder/public_id.jpg
        const parts = imageUrl.split('/');
        const lastPart = parts[parts.length - 1]; // public_id.jpg
        const publicIdWithExtension = lastPart.split('.')[0];

        // Cloudinary folder path
        const folderParts = imageUrl.split('/upload/')[1].split('/');
        folderParts.shift(); // remove version (v12345678)
        const publicId = folderParts.join('/').split('.')[0];

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        // We don't necessarily want to throw here to avoid blocking main flows
    }
};

export const cloudinaryUtils = {
    uploadImage,
    deleteImageByUrl,
};
