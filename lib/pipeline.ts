export interface DocumentVariants {
  auditPixelated: string;
  auditBlurred: string;
  scannerContrast: string;
  rawOptimized: string;
}

export function buildDocumentPipeline(
  cloudName: string,
  publicId: string
): DocumentVariants {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Native, zero-failure emerald badge overlay
  const badgeLayer =
    'co_rgb:ffffff,l_text:Arial_18_bold:VERISCRUB%20%E2%9C%93/b_rgb:022c22,r_12,bo_2px_solid_rgb:10b981/fl_layer_apply,g_south_east,x_24,y_24';

  return {
    // 1. Pixelated face + Native VeriScrub Shield Pill Badge
    auditPixelated: `${baseUrl}/e_pixelate_faces:18/${badgeLayer}/f_auto,q_auto/${publicId}`,

    // 2. Gaussian blur face + Native VeriScrub Shield Pill Badge
    auditBlurred: `${baseUrl}/e_blur_faces:600/${badgeLayer}/f_auto,q_auto/${publicId}`,

    // 3. Document OCR / Scanner contrast mode
    scannerContrast: `${baseUrl}/e_grayscale/e_contrast:70/${badgeLayer}/f_auto,q_auto/${publicId}`,

    // 4. Raw original optimized for delivery
    rawOptimized: `${baseUrl}/f_auto,q_auto/${publicId}`,
  };
}