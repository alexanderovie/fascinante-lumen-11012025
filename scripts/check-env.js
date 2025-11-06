#!/usr/bin/env node

/**
 * Script para validar que todas las variables de entorno requeridas estén configuradas
 * Uso: pnpm run env:check
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de .env.local
const envPath = join(__dirname, '..', '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.warn('⚠️  No se pudo leer .env.local, usando process.env');
  envVars = process.env;
}

// Variables requeridas (ajusta según tu proyecto)
const required = [
  'GOOGLE_PLACES_API_KEY',
  // Agrega más variables requeridas aquí
];

// Variables opcionales pero recomendadas
const recommended = [
  'GOOGLE_CLOUD_PROJECT_ID',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

// Verificar variables requeridas
const missing = required.filter((key) => !envVars[key] || envVars[key] === '');

if (missing.length > 0) {
  console.error('❌ Variables requeridas faltantes:');
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error('\n💡 Ejecuta: pnpm run env:pull para sincronizar desde Vercel');
  process.exit(1);
}

// Verificar variables recomendadas
const missingRecommended = recommended.filter(
  (key) => !envVars[key] || envVars[key] === '',
);

if (missingRecommended.length > 0) {
  console.warn('⚠️  Variables recomendadas faltantes:');
  missingRecommended.forEach((key) => console.warn(`   - ${key}`));
  console.warn('\n💡 Estas variables son opcionales pero recomendadas');
}

// Verificar variables públicas (no deben contener secretos)
const publicVars = Object.keys(envVars).filter((key) =>
  key.startsWith('NEXT_PUBLIC_'),
);
const sensitiveInPublic = publicVars.filter((key) => {
  const value = envVars[key] || '';
  return (
    value.includes('secret') ||
    value.includes('key') ||
    value.includes('token') ||
    value.includes('password')
  );
});

if (sensitiveInPublic.length > 0) {
  console.warn('⚠️  Advertencia: Variables públicas que podrían contener secretos:');
  sensitiveInPublic.forEach((key) => console.warn(`   - ${key}`));
  console.warn('\n💡 Las variables NEXT_PUBLIC_* son expuestas al cliente');
}

console.log('\n✅ Todas las variables requeridas están configuradas');
console.log(`📊 Total de variables: ${Object.keys(envVars).length}`);
