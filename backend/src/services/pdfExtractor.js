import pdf from 'pdf-parse/lib/pdf-parse.js';

/**
 * Extract text content from a PDF buffer.
 * @param {Buffer} pdfBuffer - The raw PDF file buffer.
 * @returns {Promise<string>} Extracted text content.
 */
export async function extractTextFromPdf(pdfBuffer) {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw Object.assign(new Error('Empty PDF file received.'), { status: 400 });
  }

  // Check PDF magic bytes
  if (pdfBuffer[0] !== 0x25 || pdfBuffer[1] !== 0x50 || pdfBuffer[2] !== 0x44 || pdfBuffer[3] !== 0x46) {
    throw Object.assign(new Error('File is not a valid PDF (missing PDF header).'), { status: 400 });
  }

  try {
    const data = await pdf(pdfBuffer);

    const text = data.text || '';

    if (text.trim().length === 0) {
      // Could be a scanned document
      return '';
    }

    // Clean up: collapse excessive whitespace, remove null characters
    return text
      .replace(/\0/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{4,}/g, '\n\n\n')
      .replace(/[ \t]{3,}/g, '  ')
      .trim();
  } catch (error) {
    console.error('[PDFExtractor] Error parsing PDF:', error);
    throw Object.assign(
      new Error(`Failed to parse PDF: ${error.message}`),
      { status: 400 }
    );
  }
}
