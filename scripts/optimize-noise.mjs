import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputImagePath = './public/images/noise.webp';
const outputImagePath = './public/images/noise-optimized.webp';

async function optimizeNoise() {
  try {
    // Leer metadata original
    const metadata = await sharp(inputImagePath).metadata();
    console.log(`Imagen original: ${metadata.width}x${metadata.height}`);

    const stats = await fs.stat(inputImagePath);
    console.log(`Tamaño original: ${(stats.size / 1024).toFixed(2)} KB`);

    // Crear versión más pequeña (64x64px es suficiente para un patrón que se repite)
    // Reducir calidad para patrón de ruido (no necesita alta calidad)
    // Según Lighthouse: compresión 85, pero para patrón de ruido podemos ir más bajo
    await sharp(inputImagePath)
      .resize(64, 64, {
        fit: 'cover',
      })
      .webp({
        quality: 25, // Calidad muy baja para patrón de ruido (no afecta visualmente)
        effort: 6, // Máxima compresión
        nearLossless: false, // Permitir pérdida para mejor compresión
      })
      .toFile(outputImagePath);

    const optimizedStats = await fs.stat(outputImagePath);
    const reduction = ((stats.size - optimizedStats.size) / stats.size) * 100;

    console.log(`\n✅ Imagen optimizada creada:`);
    console.log(`   Tamaño: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
    console.log(`   Reducción: ${reduction.toFixed(1)}%`);
    console.log(`   Dimensiones: 64x64px (se repite como patrón)`);

    // Reemplazar archivo original
    await fs.rename(outputImagePath, inputImagePath);
    console.log(`\n✅ Archivo original reemplazado con versión optimizada`);
  } catch (error) {
    console.error('Error durante optimización:', error);
  }
}

optimizeNoise();
