import {getEnvVar} from './getEnvVar.js'

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'), 
  api_key: getEnvVar('CLOUDINARY_API_KEY'), 
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export function uploadToCloudinary (filePath){
	return cloudinary.uploader.upload(filePath);

};