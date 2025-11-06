#!/usr/bin/env node

/**
 * Script para subir variables de .env.local a Vercel
 * ⚠️  ADVERTENCIA: Este script es peligroso, mejor usa vercel env add manualmente
 * Uso: pnpm run env:push (NO RECOMENDADO - usar vercel env add en su lugar)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.warn('⚠️  ADVERTENCIA: Este script puede sobrescribir variables en Vercel');
console.warn('⚠️  Se recomienda usar "vercel env add" manualmente en su lugar\n');

const envPath = join(__dirname, '..', '.env.local');

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  console.log('📋 Variables encontradas en .env.local:\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const envKey = key.trim();
        const envValue = valueParts.join('=').trim();

        if (envValue) {
          console.log(`   ${envKey}: ${envValue.substring(0, 20)}...`);
          console.log(
            `   → Ejecuta: vercel env add ${envKey} production preview development`,
          );
        }
      }
    }
  });

  console.log(
    '\n💡 Para agregar variables manualmente, usa: vercel env add VARIABLE_NAME',
  );
  console.log('💡 Para sincronizar desde Vercel, usa: pnpm run env:pull');
} catch (error) {
  console.error('❌ Error leyendo .env.local:', error.message);
  process.exit(1);
}
