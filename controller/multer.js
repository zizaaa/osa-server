import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the "uploads" folder exists, if not, create it
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the folder if it doesn't exist
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Ensure the directory exists
    },
    filename: (req, file, cb) => {
        // Use the original filename for storage
        // Add a timestamp prefix to ensure uniqueness
        cb(null, `${file.originalname}-${Date.now()}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'text/csv']; // Only allow PDF files
        // const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        // const mimeType = allowedTypes.test(file.mimetype);
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
          } else {
            cb(new Error('Only PDF and CSV files are allowed!'), false); // Reject the file
        }

        // if (extname && mimeType) {
        //     return cb(null, true); // Accept the file
        // } else {
        //     return cb(new Error('Only PDF files are allowed'), false); // Reject the file
        // }
    }
});

export { upload };