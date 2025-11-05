import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputImage = join(projectRoot, 'public/layout/images/logo-image.png');
const outputImage = join(projectRoot, 'public/layout/images/logo-image-optimized.png');

try {
  const metadata = await sharp(inputImage).metadata();
  console.log(`Imagen original: ${metadata.width}x${metadata.height}`);

  const originalSize = statSync(inputImage).size;
  console.log(`Tamaño original: ${originalSize} bytes`);

  // Redimensionar manteniendo proporción (ancho máximo 1230px)
  const maxWidth = 1230;
  const ratio = maxWidth / metadata.width;
  const newHeight = Math.round(metadata.height * ratio);

  await sharp(inputImage)
    .resize(maxWidth, newHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png({
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(outputImage);

  const optimizedSize = statSync(outputImage).size;
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  console.log(`\n✅ Imagen optimizada creada:`);
  console.log(`   Tamaño: ${optimizedSize} bytes`);
  console.log(`   Reducción: ${reduction}%`);
  console.log(`   Dimensiones: ${maxWidth}x${newHeight}`);
} catch (error) {
  console.error('Error optimizando imagen:', error);
  process.exit(1);
}
