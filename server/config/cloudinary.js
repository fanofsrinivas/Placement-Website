const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'cpms/resumes',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw',
    },
});

const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'cpms/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    },
});

const excelStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'cpms/excel',
        allowed_formats: ['xlsx', 'xls', 'csv'],
        resource_type: 'raw',
    },
});

module.exports = { cloudinary, resumeStorage, logoStorage, excelStorage };
