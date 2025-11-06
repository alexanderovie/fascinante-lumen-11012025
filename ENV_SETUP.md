# 🔐 Variables de Entorno Requeridas

Este documento lista todas las credenciales necesarias para el proyecto, especialmente para la integración de **Google Places API** y **Upstash Redis**.

> 📖 **Para gestión avanzada de variables de entorno, consulta:** [`docs/ENV_MANAGEMENT.md`](../docs/ENV_MANAGEMENT.md)

---

## 📋 Variables Requeridas para `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

### 1. **Google Places API (New)** - REST API Moderna (Nov 2025)

```bash
# API Key para REST API (Server-side, recomendado)
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here

# O si prefieres usar la variable pública (fallback)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key-here

# Project ID (opcional, para referencia)
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
```

**Cómo obtenerlas:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita **Places API (New)** y **Maps JavaScript API**
4. Ve a **APIs & Services > Credentials**
5. Crea una **API Key** con restricciones:
   - **Application restrictions**: HTTP referrers (websites) - agrega tus dominios (localhost, fascinantedigital.com)
   - **API restrictions**: Solo "Places API (New)" y "Maps JavaScript API"

**Nota:** Usamos la REST API moderna (`https://places.googleapis.com/v1/places:autocomplete`) en lugar del JavaScript API obsoleto (`google.maps.places.Autocomplete`), eliminando warnings y mejorando rendimiento.

---

### 1.1. **Google PageSpeed Insights API** - Análisis de Performance (Nov 2025)

```bash
# API Key para PageSpeed Insights (Server-side)
GOOGLE_PAGESPEED_INSIGHTS_API_KEY=your-pagespeed-insights-api-key-here
```

**Cómo obtenerla:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el mismo proyecto que usas para Places API
3. Habilita **PageSpeed Insights API**
4. Ve a **APIs & Services > Credentials**
5. Puedes usar la misma API Key de Places API (si tiene PageSpeed habilitado) o crear una nueva
6. Agrega restricción de API: "PageSpeed Insights API"

**Endpoint moderno:**
- `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed` (v5 - recomendado)
- Proporciona métricas de Performance, Core Web Vitals (FCP, LCP, CLS, INP, TTFB)
- Gratuita hasta 25,000 requests/día

**Nota:** Esta API es esencial para la página de resultados de auditoría, proporcionando datos reales de rendimiento web.

---

### 2. **Upstash Redis** - Caching

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token-here
```

**Cómo obtenerlas:**
1. Ve a [Upstash Console](https://console.upstash.com/)
2. Crea una nueva base de datos **Redis** (tier gratuito disponible)
3. En la pestaña **Details**, encontrarás:
   - `UPSTASH_REDIS_REST_URL` (REST URL)
   - `UPSTASH_REDIS_REST_TOKEN` (REST Token)

**Ventajas de Upstash:**
- ✅ Tier gratuito generoso (10K commands/día)
- ✅ Compatible con Redis estándar
- ✅ REST API (perfecto para serverless)
- ✅ Baja latencia global

---

### 3. **DataForSEO API** (Opcional - Si ya lo tienes configurado)

```bash
# Si usas autenticación directa
DATAFORSEO_API_LOGIN=your-dataforseo-login
DATAFORSEO_API_PASSWORD=your-dataforseo-password

# O si usas proxy personalizado
DATAFORSEO_PROXY_URL=https://data.fascinantedigital.com/v3/
```

---

### 4. **Next.js Environment** (Opcional)

```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Configuración Rápida

### Paso 1: Crear `.env.local`

```bash
# En la raíz del proyecto
touch .env.local
```

### Paso 2: Agregar las variables

Copia las variables necesarias desde arriba y completa los valores.

### Paso 3: Verificar que funciona

```bash
pnpm dev
```

---

## 📝 Ejemplo de `.env.local` completo

```bash
# Google Places API (REST API Moderna)
GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_CLOUD_PROJECT_ID=fascinante-digital-prod

# Google PageSpeed Insights API
GOOGLE_PAGESPEED_INSIGHTS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Upstash Redis (si aplica)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token-here

# DataForSEO (si aplica)
DATAFORSEO_PROXY_URL=https://data.fascinantedigital.com/v3/

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ⚠️ Seguridad

- **NUNCA** commitees `.env.local` al repositorio (ya está en `.gitignore`)
- **NUNCA** compartas tus credenciales públicamente
- Configura **restricciones** en todas las API Keys (HTTP referrers, API restrictions)
- Usa `GOOGLE_PLACES_API_KEY` (server-side) en lugar de `NEXT_PUBLIC_*` cuando sea posible
- Rota las credenciales periódicamente

---

## 🔗 Enlaces Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Google Places API (New) Docs](https://cloud.google.com/maps-platform/places)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
