import multer from 'multer'

const storage = multer.memoryStorage(); 

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new Error('Only image files are allowed'), false);
        }
        callback(null, true);
    }
});

export default upload;
