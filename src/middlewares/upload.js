import multer from 'multer';
import path from 'node:path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('src', 'tmp'));
    },
    filename: function (req, file, cb) {
		const uniqueSuffix = Date.now()+'-'+ (Math.random() * 1e9);
        cb(null, 'file.originalname'+'-' + uniqueSuffix);
    },
});

// const upload = multer({ storage: storage });
export const upload = multer({ storage });
