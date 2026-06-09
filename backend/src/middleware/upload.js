import multer from 'multer';

/**
 * Multer configuration — handles PDF uploads in memory (no disk writes).
 */
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'application/vnd.pdf',
    'text/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error('Invalid file type. Please upload a PDF file only.'),
        { status: 400 }
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
    files: 1,
  },
});
