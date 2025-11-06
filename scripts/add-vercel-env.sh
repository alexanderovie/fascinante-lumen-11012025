#!/bin/bash

# Script para agregar variables de entorno a Vercel
# Uso: ./scripts/add-vercel-env.sh

echo "🚀 Agregando variables de entorno a Vercel..."
echo ""
echo "⚠️  IMPORTANTE: Este script te pedirá el valor de cada variable."
echo "   Tienes que ingresarlo manualmente cuando se te solicite."
echo ""

# Leer variables desde .env.local si existe
if [ -f .env.local ]; then
  echo "📋 Variables encontradas en .env.local:"
  echo ""
  
  # Google Places API Key
  if grep -q "GOOGLE_PLACES_API_KEY=" .env.local || grep -q "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=" .env.local; then
    echo "1️⃣  GOOGLE_PLACES_API_KEY (o NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)"
    echo "   Ejecuta: npx vercel env add GOOGLE_PLACES_API_KEY production preview development"
    echo ""
  fi
  
  # Upstash Redis
  if grep -q "UPSTASH_REDIS_REST_URL=" .env.local; then
    echo "2️⃣  UPSTASH_REDIS_REST_URL (opcional)"
    echo "   Ejecuta: npx vercel env add UPSTASH_REDIS_REST_URL production preview development"
    echo ""
  fi
  
  if grep -q "UPSTASH_REDIS_REST_TOKEN=" .env.local; then
    echo "3️⃣  UPSTASH_REDIS_REST_TOKEN (opcional)"
    echo "   Ejecuta: npx vercel env add UPSTASH_REDIS_REST_TOKEN production preview development"
    echo ""
  fi
  
  # Google Cloud Project ID
  if grep -q "GOOGLE_CLOUD_PROJECT_ID=" .env.local; then
    echo "4️⃣  GOOGLE_CLOUD_PROJECT_ID (opcional)"
    echo "   Ejecuta: npx vercel env add GOOGLE_CLOUD_PROJECT_ID production preview development"
    echo ""
  fi
else
  echo "⚠️  No se encontró .env.local"
  echo "   Crea el archivo primero o agrega las variables manualmente."
fi

echo "✅ Después de agregar todas las variables, ejecuta:"
echo "   pnpm run env:pull"
echo ""

