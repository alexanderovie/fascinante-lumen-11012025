# 🔧 Análisis de Tecnologías para PageSpeed Insights API

Análisis de qué tecnologías adicionales necesitamos para implementar PageSpeed Insights API de forma elite, considerando lo que ya tenemos y lo que realmente necesitamos.

---

## 📊 Estado Actual del Proyecto

### ✅ Tecnologías Ya Instaladas

- **Next.js 15.5.6** (App Router, Server Actions, API Routes)
- **Vercel** (Hosting, Edge Functions, Environment Variables)
- **Google Places API** (Ya configurado)
- **Google PageSpeed Insights API** (API Key configurada)
- **Cloudflare** (DNS - ya configurado)

### 📝 Tecnologías Documentadas pero NO Instaladas

- **Upstash Redis** (Mencionado en `ENV_SETUP.md` pero no en `package.json`)

---

## 🎯 Análisis de Necesidades para PageSpeed Insights

### Problema Principal

PageSpeed Insights API tiene características que requieren consideraciones especiales:

1. **Tiempo de respuesta**: 30-60 segundos por request
2. **Quota limitada**: ~25,000 requests/día (tier gratuito)
3. **Costos**: Cada request consume quota
4. **Rate limiting**: Google limita requests concurrentes

---

## 🔍 Tecnologías Evaluadas

### 1. **Upstash Redis** ⭐ **NECESARIO**

#### ¿Por qué es necesario?

- **Caching agresivo**: PageSpeed tarda 30-60 segundos. No queremos repetir llamadas para la misma URL.
- **Rate limiting**: Proteger contra abuso (10 requests/hora por IP)
- **Costo-efectivo**: Evitar llamadas innecesarias a PageSpeed API

#### Implementación

```bash
# Instalar
pnpm add @upstash/redis

# Configurar en .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token-here
```

#### Costo

- **Tier Gratuito**: 10,000 commands/día
- **Tier Pago**: Desde $0.20/100K commands
- **Para nuestro caso**: Tier gratuito es suficiente (cache + rate limiting)

#### Alternativa sin Upstash

```typescript
// Cache en memoria (solo para desarrollo, NO producción)
const memoryCache = new Map<string, { data: unknown; expires: number }>();
```

**Problema**: No funciona en serverless (Vercel) porque cada función es stateless.

**Conclusión**: ⭐ **Upstash Redis es NECESARIO para producción**

---

### 2. **Inngest** ⚠️ **RECOMENDADO pero OPCIONAL**

#### ¿Por qué es recomendado?

- **Procesamiento asíncrono**: PageSpeed tarda 30-60 segundos. Mejor hacerlo en background.
- **Mejor UX**: Usuario no espera 60 segundos con la página bloqueada.
- **Retry automático**: Si falla, reintenta automáticamente.
- **Webhooks**: Notificar al frontend cuando termine.

#### Flujo con Inngest

```
Usuario → Submit Form → API Route → Inngest Job (async) → PageSpeed API
                                                              ↓
                                                         Cache Result
                                                              ↓
                                                         Webhook → Frontend
```

#### Implementación

```bash
# Instalar
pnpm add inngest

# Crear función
// src/app/api/inngest/route.ts
import { Inngest } from 'inngest';

const inngest = new Inngest({ id: 'fascinante-digital' });

export const { serve } = inngest.createFunction(
  { id: 'pagespeed-analysis' },
  { event: 'audit/pagespeed.requested' },
  async ({ event, step }) => {
    const result = await step.run('fetch-pagespeed', async () => {
      // Llamar a PageSpeed API (30-60 segundos)
      return await fetchPageSpeedData(event.data.url);
    });

    await step.run('cache-result', async () => {
      await redis.setex(`pagespeed:${event.data.url}`, 86400, JSON.stringify(result));
    });

    await step.run('notify-frontend', async () => {
      // Webhook o Server-Sent Events
    });
  }
);
```

#### Costo

- **Tier Gratuito**: 25,000 function invocations/mes
- **Tier Pago**: Desde $20/mes
- **Para nuestro caso**: Tier gratuito puede ser suficiente inicialmente

#### Alternativa sin Inngest

```typescript
// Polling desde el frontend (menos elegante)
useEffect(() => {
  const interval = setInterval(async () => {
    const result = await fetch('/api/audit/pagespeed/status');
    if (result.completed) {
      setData(result.data);
      clearInterval(interval);
    }
  }, 2000); // Poll cada 2 segundos
}, []);
```

**Problema**: Menos eficiente, más requests, peor UX.

**Conclusión**: ⚠️ **Inngest es RECOMENDADO para mejor UX, pero podemos empezar sin él**

---

### 3. **Cloudflare** ✅ **YA LO TIENES - NO NECESARIO ADICIONAL**

#### Estado Actual

- Ya configurado para DNS
- No necesario para PageSpeed específicamente

#### Uso Potencial (Opcional)

- **Cloudflare Workers**: Para cache edge (pero Upstash Redis ya cubre esto)
- **Cloudflare R2**: Para almacenar resultados grandes (no necesario)

**Conclusión**: ✅ **Ya lo tienes, no necesitas configurar nada adicional**

---

## 📋 Recomendación Final

### Fase 1: MVP (Mínimo Viable) ⭐

**Tecnologías necesarias:**

1. ✅ **Upstash Redis** - **INSTALAR**
   - Cache de resultados (24 horas)
   - Rate limiting por IP
   - **Costo**: Gratis (tier gratuito suficiente)

**Implementación:**

```bash
# 1. Instalar
pnpm add @upstash/redis

# 2. Configurar variables de entorno
# (Ya documentado en ENV_SETUP.md)

# 3. Usar en API route
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

**Resultado**: Funciona, pero usuario espera 30-60 segundos.

---

### Fase 2: Mejora UX (Recomendado) ⚠️

**Tecnologías adicionales:**

2. ⚠️ **Inngest** - **OPCIONAL pero RECOMENDADO**
   - Procesamiento asíncrono
   - Mejor UX (no bloquea)
   - **Costo**: Gratis inicialmente (25K invocations/mes)

**Implementación:**

```bash
# 1. Instalar
pnpm add inngest

# 2. Configurar en Vercel
# (Inngest se conecta automáticamente)

# 3. Crear función asíncrona
# (Ver ejemplo arriba)
```

**Resultado**: UX mejorada, usuario ve progreso en tiempo real.

---

## 💰 Comparación de Costos

| Tecnología | Tier Gratuito | Tier Pago | ¿Necesario? |
|------------|---------------|-----------|-------------|
| **Upstash Redis** | 10K commands/día | $0.20/100K | ⭐ **SÍ** |
| **Inngest** | 25K invocations/mes | $20/mes | ⚠️ **Opcional** |
| **Cloudflare** | Ya configurado | - | ✅ **Ya lo tienes** |

---

## 🚀 Plan de Implementación Recomendado

### Paso 1: Instalar Upstash Redis (CRÍTICO)

```bash
# 1. Instalar package
pnpm add @upstash/redis

# 2. Crear cuenta en Upstash (gratis)
# https://console.upstash.com/

# 3. Crear base de datos Redis
# 4. Obtener REST URL y Token
# 5. Agregar a .env.local
# 6. Subir a Vercel con vercel env add
```

### Paso 2: Implementar Cache en API Route

```typescript
// src/app/api/audit/pagespeed/route.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  // 1. Verificar cache
  const cacheKey = `pagespeed:${url}:${strategy}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
  }

  // 2. Llamar a PageSpeed API
  const result = await fetchPageSpeedData(url);

  // 3. Guardar en cache (24 horas)
  await redis.setex(cacheKey, 86400, JSON.stringify(result));

  return NextResponse.json(result);
}
```

### Paso 3: (Opcional) Agregar Inngest para UX Mejorada

```bash
# Solo si quieres mejor UX (procesamiento asíncrono)
pnpm add inngest
```

---

## ✅ Checklist de Decisión

### Para MVP (Funciona, pero usuario espera):

- [x] Next.js 15 (ya tienes)
- [x] Vercel (ya tienes)
- [x] Google PageSpeed API Key (ya configurado)
- [ ] **Upstash Redis** (INSTALAR - crítico para cache)
- [ ] Implementar cache en API route
- [ ] Implementar rate limiting

### Para UX Mejorada (Recomendado):

- [ ] Todo lo de MVP +
- [ ] **Inngest** (OPCIONAL - para procesamiento asíncrono)
- [ ] Webhooks o Server-Sent Events para notificar frontend
- [ ] UI de progreso en tiempo real

---

## 🎯 Conclusión

### Tecnologías Necesarias:

1. ⭐ **Upstash Redis** - **CRÍTICO** (cache + rate limiting)
   - **Costo**: Gratis (tier gratuito suficiente)
   - **Instalación**: 5 minutos
   - **Impacto**: Alto (evita llamadas repetidas)

2. ⚠️ **Inngest** - **OPCIONAL** (mejor UX)
   - **Costo**: Gratis inicialmente
   - **Instalación**: 15 minutos
   - **Impacto**: Medio (mejor experiencia de usuario)

3. ✅ **Cloudflare** - **YA LO TIENES** (no necesario adicional)

### Recomendación:

**Empezar con Upstash Redis** (crítico para producción). Agregar Inngest después si quieres mejorar la UX.

---

**Última actualización**: Noviembre 2025
