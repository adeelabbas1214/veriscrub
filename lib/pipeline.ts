export interface DocumentVariants {
  rawOptimized: string;
  auditBlurred: string;
  auditPixelated: string;
  scannerContrast: string;
}

export function buildDocumentPipeline(cloudName: string, publicId: string): DocumentVariants {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  return {
    // 1. Raw original image with automatic format and quality compression
    rawOptimized: `${baseUrl}/f_auto,q_auto/${publicId}`,

    // 2. High-strength Gaussian blur on detected facial regions
    auditBlurred: `${baseUrl}/e_blur_faces:1000/f_auto,q_auto/${publicId}`,

    // 3. Pixelated mosaic effect on detected facial regions
    auditPixelated: `${baseUrl}/e_pixelate_faces:35/f_auto,q_auto/${publicId}`,

    // 4. Scanner legibility mode (sharpening + contrast boost) with face redaction
    scannerContrast: `${baseUrl}/e_blur_faces:1000/e_contrast:30/e_sharpen:100/f_auto,q_auto/${publicId}`,
  };
}