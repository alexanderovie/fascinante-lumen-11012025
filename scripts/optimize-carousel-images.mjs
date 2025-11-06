import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const imagesToOptimize = [
  {
    input: './public/images/features-carousel/1.webp',
    maxWidth: 500,
    maxHeight: 500,
  },
  {
    input: './public/images/features-carousel/2.webp',
    maxWidth: 500,
    maxHeight: 500,
  },
  {
    input: './public/images/features-carousel/3.webp',
    maxWidth: 500,
    maxHeight: 500,
  },
  {
    input: './public/images/features-carousel/4.webp',
    maxWidth: 500,
    maxHeight: 500,
  },
  {
    input: './public/images/hero.webp',
    maxWidth: 1056,
    maxHeight: 753,
  },
];

async function optimizeImage(inputPath, maxWidth, maxHeight) {
  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;
    const metadata = await sharp(inputPath).metadata();

    console.log(`\n📸 Optimizando: ${path.basename(inputPath)}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(2)} KB`);

    // Optimizar manteniendo proporciones
    await sharp(inputPath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 75, // Calidad balanceada según Chrome Developers
        effort: 6, // Máxima compresión
      })
      .toFile(inputPath + '.tmp');

    const optimizedStats = await fs.stat(inputPath + '.tmp');
    const reduction = ((originalSize - optimizedStats.size) / originalSize) * 100;

    console.log(`   Optimizado: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
    console.log(`   Reducción: ${reduction.toFixed(1)}%`);

    // Reemplazar archivo original
    await fs.rename(inputPath + '.tmp', inputPath);
    console.log(`   ✅ Archivo optimizado`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function optimizeAll() {
  console.log('🚀 Optimizando imágenes según Chrome Developers recommendations...\n');

  for (const image of imagesToOptimize) {
    await optimizeImage(image.input, image.maxWidth, image.maxHeight);
  }

  console.log('\n✅ Optimización completada');
}

optimizeAll();
