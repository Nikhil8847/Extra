const cloudinary = require('cloudinary').v2


const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_secret = process.env.CLOUDINARY_SECRET_KEY;
const api_key = process.env.CLOUDINARY_API_KEY;

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
})

const uploadToCloudinary = (path, folder) => {
    return cloudinary.uploader.upload(path, {folder}).then((data) => {
        return {url: data.url, public_id: data.public_id};
    }).catch(error => console.log(error))
}

const removeFromCloudinary = async (public_id) => {
    await cloudinary.uploader.destroy(public_id, function(error, result) {
        console.log(result, error);
    })
}

module.exports = {uploadToCloudinary, removeFromCloudinary};