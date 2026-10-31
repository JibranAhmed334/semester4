import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const delete_from_cloudinary = async (public_id) =>{
    await cloudinary.uploader.destroy(public_id)
    console.log("file deleted from cloudinary with public_id ")
}

export default delete_from_cloudinary;