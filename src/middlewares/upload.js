const multer = require('multer');
const path = require('path');
const fs = require('fs');
const InvariantError = require('../exceptions/InvariantError');

// Ensure upload destination directory exists
const uploadDir = path.resolve(__dirname, '../../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept only PDF documents
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new InvariantError('File is required and must be in PDF format'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum file size
  },
  fileFilter,
});

// Wrapper middleware to gracefully handle Multer errors
const uploadDocumentMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('document');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new InvariantError('File is required and size must not exceed 5MB')
        );
      }
      return next(new InvariantError(err.message));
    }
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return next(new InvariantError('File is required'));
    }
    next();
  });
};

module.exports = uploadDocumentMiddleware;
