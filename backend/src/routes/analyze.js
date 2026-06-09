import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { extractTextFromPdf } from '../services/pdfExtractor.js';
import { analyzeResume } from '../services/ai.js';

export const analyzeRouter = Router();

/**
 * POST /api/analyze
 * Accepts a PDF file, extracts text, and returns AI-generated analysis.
 */
analyzeRouter.post('/', (req, res, next) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      // Multer errors (file too large, wrong type, etc.)
      const status = err.status || 400;
      return res.status(status).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach a PDF resume.' });
    }

    try {
      // Step 1: Extract text from the PDF buffer
      const extractedText = await extractTextFromPdf(req.file.buffer);

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          error: 'Could not extract any text from this PDF. The file may be scanned/image-based (OCR not supported).',
        });
      }

      // Step 2: Send to OpenAI for analysis
      const analysis = await analyzeResume(extractedText);

      // Step 3: Return the result
      res.json({
        success: true,
        data: {
          filename: req.file.originalname,
          fileSize: req.file.size,
          extractedText: extractedText.slice(0, 3000), // preview
          analysis,
        },
      });
    } catch (error) {
      next(error);
    }
  });
});
