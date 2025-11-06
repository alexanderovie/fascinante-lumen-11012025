# 🚀 PageSpeed Insights API - Guía de Integración Elite

Esta guía documenta las mejores prácticas de la industria (Nov 2025) para integrar Google PageSpeed Insights API en el dashboard de auditoría, manteniendo consistencia con el UI del sitio y siguiendo estándares elite.

---

## 📋 Tabla de Contenidos

1. [Arquitectura y Flujo](#arquitectura-y-flujo)
2. [Manejo de Errores](#manejo-de-errores)
3. [Caching y Rate Limiting](#caching-y-rate-limiting)
4. [Estados de UI](#estados-de-ui)
5. [Validación y Sanitización](#validación-y-sanitización)
6. [Timeouts y Retry Logic](#timeouts-y-retry-logic)
7. [Normalización de Datos](#normalización-de-datos)
8. [Optimización de Costos](#optimización-de-costos)
9. [Logging y Monitoreo](#logging-y-monitoreo)
10. [Implementación de Referencia](#implementación-de-referencia)

---

## 🏗️ Arquitectura y Flujo

### Flujo Recomendado

```
Usuario → Formulario → API Route (/api/audit/pagespeed) → PageSpeed API → Cache → UI
                                                              ↓
                                                         Error Handler
                                                              ↓
                                                         Fallback/Retry
```

### Principios Elite

1. **Server-Side Only**: Nunca exponer API keys al cliente
2. **Progressive Enhancement**: Mostrar UI básica mientras carga
3. **Graceful Degradation**: Funcionar sin datos si la API falla
4. **Consistent UX**: Mantener el mismo estilo visual del sitio

---

## ⚠️ Manejo de Errores

### Categorías de Errores

#### 1. **Errores de Validación (400)**
```typescript
// URL inválida o mal formada
if (!isValidUrl(url)) {
  return NextResponse.json(
    { 
      error: 'INVALID_URL',
      message: 'La URL proporcionada no es válida',
      code: 'VALIDATION_ERROR'
    },
    { status: 400 }
  );
}
```

#### 2. **Errores de Autenticación (401/403)**
```typescript
// API key inválida o sin permisos
if (response.status === 401 || response.status === 403) {
  return NextResponse.json(
    {
      error: 'AUTHENTICATION_ERROR',
      message: 'Error de autenticación con PageSpeed Insights API',
      code: 'API_KEY_INVALID',
      // NO exponer detalles sensibles al cliente
    },
    { status: 500 } // 500 para no revelar detalles al cliente
  );
}
```

#### 3. **Rate Limiting (429)**
```typescript
// Quota excedida (25,000 requests/día)
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  return NextResponse.json(
    {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Límite de solicitudes excedido. Intenta más tarde.',
      code: 'QUOTA_EXCEEDED',
      retryAfter: retryAfter ? parseInt(retryAfter) : 3600, // 1 hora por defecto
    },
    { status: 429 }
  );
}
```

#### 4. **Timeouts (408/504)**
```typescript
// Timeout de la API (PageSpeed puede tardar 30-60 segundos)
if (error.name === 'AbortError' || response.status === 408 || response.status === 504) {
  return NextResponse.json(
    {
      error: 'TIMEOUT_ERROR',
      message: 'La solicitud tardó demasiado. Intenta con una URL más simple.',
      code: 'REQUEST_TIMEOUT',
    },
    { status: 408 }
  );
}
```

#### 5. **Errores del Servidor (500/502/503)**
```typescript
// Error interno de Google
if (response.status >= 500) {
  return NextResponse.json(
    {
      error: 'SERVER_ERROR',
      message: 'Error temporal del servidor. Intenta nuevamente en unos momentos.',
      code: 'GOOGLE_SERVER_ERROR',
    },
    { status: 502 } // Bad Gateway
  );
}
```

#### 6. **Errores de Red**
```typescript
// Error de conexión
catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      {
        error: 'NETWORK_ERROR',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: 'CONNECTION_FAILED',
      },
      { status: 503 }
    );
  }
}
```

### Estructura de Respuesta de Error Estándar

```typescript
interface ApiError {
  error: string;           // Código de error legible
  message: string;        // Mensaje amigable para el usuario
  code: string;           // Código técnico para debugging
  details?: unknown;      // Detalles adicionales (solo en desarrollo)
  retryAfter?: number;    // Segundos antes de reintentar (si aplica)
  timestamp: string;     // ISO timestamp
}
```

---

## 💾 Caching y Rate Limiting

### Estrategia de Caching

#### 1. **Cache por URL (Recomendado)**
```typescript
// Cachear resultados por 24 horas (PageSpeed no cambia frecuentemente)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en ms

// Usar Redis/Upstash para cache distribuido
const cacheKey = `pagespeed:${normalizedUrl}:${strategy}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return NextResponse.json(JSON.parse(cached), {
    headers: {
      'X-Cache': 'HIT',
      'Cache-Control': 'public, max-age=86400', // 24 horas
    },
  });
}

// Después de obtener datos de API
await redis.setex(cacheKey, 86400, JSON.stringify(data)); // 24 horas
```

#### 2. **Cache en Memoria (Fallback)**
```typescript
// Para desarrollo o si Redis no está disponible
const memoryCache = new Map<string, { data: unknown; expires: number }>();

function getCached(url: string) {
  const cached = memoryCache.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  memoryCache.delete(url);
  return null;
}
```

### Rate Limiting

#### 1. **Rate Limiting por Usuario/IP**
```typescript
// Limitar a 10 requests por hora por IP
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hora

const ip = request.headers.get('x-forwarded-for') || 'unknown';
const key = `ratelimit:pagespeed:${ip}`;
const count = await redis.incr(key);

if (count === 1) {
  await redis.expire(key, RATE_WINDOW / 1000);
}

if (count > RATE_LIMIT) {
  return NextResponse.json(
    {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Has excedido el límite de solicitudes. Intenta más tarde.',
      retryAfter: await redis.ttl(key),
    },
    { status: 429 }
  );
}
```

---

## 🎨 Estados de UI

### Estados Requeridos

#### 1. **Loading State**
```typescript
// Mostrar skeleton/placeholder mientras carga
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
const [progress, setProgress] = useState(0); // 0-100

// Simular progreso (PageSpeed tarda 30-60 segundos)
useEffect(() => {
  if (status === 'loading') {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90)); // Máximo 90% hasta que termine
    }, 3000); // Cada 3 segundos
    return () => clearInterval(interval);
  }
}, [status]);
```

#### 2. **Error State (Consistente con el sitio)**
```typescript
// Usar el mismo componente de error que otras partes del sitio
<Card className="border-destructive">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <AlertCircle className="text-destructive size-5" />
      Error al Analizar
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">{errorMessage}</p>
    {errorCode === 'RATE_LIMIT_EXCEEDED' && (
      <Button onClick={handleRetry} disabled={retryAfter > 0}>
        Reintentar {retryAfter > 0 && `(${retryAfter}s)`}
      </Button>
    )}
  </CardContent>
</Card>
```

#### 3. **Empty State**
```typescript
// Si no hay datos pero no hay error
<Card>
  <CardContent className="flex flex-col items-center justify-center py-12">
    <FileSearch className="text-muted-foreground mb-4 size-12" />
    <p className="text-muted-foreground text-center">
      Completa el formulario para ver los resultados
    </p>
  </CardContent>
</Card>
```

#### 4. **Success State (Con animación)**
```typescript
// Animar la aparición de resultados (consistente con Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <DonutChart value={performanceScore} />
</motion.div>
```

---

## ✅ Validación y Sanitización

### Validación de URL

```typescript
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Solo permitir HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Validar formato de dominio
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return false;
    }
    // Prevenir URLs locales/privadas (seguridad)
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Normalizar URL
function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  // Remover trailing slash
  parsed.pathname = parsed.pathname.replace(/\/$/, '');
  // Forzar HTTPS
  parsed.protocol = 'https:';
  return parsed.toString();
}
```

### Validación de Strategy

```typescript
type Strategy = 'mobile' | 'desktop';

function isValidStrategy(strategy: unknown): strategy is Strategy {
  return strategy === 'mobile' || strategy === 'desktop';
}
```

---

## ⏱️ Timeouts y Retry Logic

### Timeout Configuration

```typescript
// PageSpeed puede tardar 30-60 segundos, usar timeout de 90 segundos
const TIMEOUT_MS = 90 * 1000; // 90 segundos

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

try {
  const response = await fetch(apiUrl, {
    signal: controller.signal,
    // ... otros options
  });
  clearTimeout(timeoutId);
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    // Manejar timeout
  }
}
```

### Retry Logic (Exponential Backoff)

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Solo reintentar en errores 5xx o timeouts
      if (response.status < 500 || attempt === maxRetries - 1) {
        return response;
      }

      // Exponential backoff: 2^attempt segundos
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      lastError = new Error(`Attempt ${attempt + 1} failed`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

---

## 🔄 Normalización de Datos

### Estructura de Datos Normalizada

```typescript
interface PageSpeedResult {
  // Performance Score (0-100)
  performance: {
    score: number;
    mobile: number;
    desktop: number;
  };
  
  // Core Web Vitals
  coreWebVitals: {
    fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    inp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  };
  
  // SEO Score
  seo: {
    score: number;
    issues: Array<{
      id: string;
      title: string;
      severity: 'critical' | 'warning' | 'info';
      impact: 'high' | 'medium' | 'low';
    }>;
  };
  
  // Metadata
  metadata: {
    url: string;
    analyzedAt: string; // ISO timestamp
    strategy: 'mobile' | 'desktop';
    lighthouseVersion: string;
  };
}

// Función de normalización
function normalizePageSpeedData(
  apiResponse: unknown,
  url: string,
  strategy: Strategy
): PageSpeedResult {
  const data = apiResponse as {
    lighthouseResult: {
      categories: {
        performance: { score: number };
        seo: { score: number };
      };
      audits: Record<string, { numericValue?: number; score?: number }>;
      lighthouseVersion: string;
    };
  };

  // Extraer y normalizar datos
  const performanceScore = Math.round(
    (data.lighthouseResult.categories.performance.score || 0) * 100
  );

  // Normalizar Core Web Vitals
  const lcp = data.lighthouseResult.audits['largest-contentful-paint'];
  const fcp = data.lighthouseResult.audits['first-contentful-paint'];
  // ... etc

  return {
    performance: {
      score: performanceScore,
      mobile: strategy === 'mobile' ? performanceScore : 0,
      desktop: strategy === 'desktop' ? performanceScore : 0,
    },
    // ... resto de datos normalizados
  };
}
```

---

## 💰 Optimización de Costos

### Estrategias de Ahorro

1. **Cache Agresivo**: 24 horas mínimo (PageSpeed no cambia frecuentemente)
2. **Request Batching**: Analizar mobile y desktop en una sola llamada si es posible
3. **Lazy Loading**: Solo analizar cuando el usuario lo solicita explícitamente
4. **Field Masking**: Solicitar solo los campos necesarios (si la API lo soporta)

```typescript
// Solo solicitar categorías necesarias
const categories = ['performance', 'seo']; // No 'accessibility', 'best-practices', etc.
const apiUrl = `${BASE_URL}?url=${url}&category=${categories.join(',')}`;
```

---

## 📊 Logging y Monitoreo

### Logging Estructurado

```typescript
// Usar logger estructurado (consistente con el resto del proyecto)
import { logger } from '@/lib/logger';

logger.info('pagespeed_request_started', {
  url: normalizedUrl,
  strategy,
  ip: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString(),
});

logger.error('pagespeed_request_failed', {
  url: normalizedUrl,
  error: error.message,
  code: error.code,
  status: response?.status,
  timestamp: new Date().toISOString(),
});
```

### Métricas a Monitorear

1. **Request Duration**: Tiempo promedio de respuesta
2. **Error Rate**: Porcentaje de errores por tipo
3. **Cache Hit Rate**: Efectividad del cache
4. **Rate Limit Hits**: Frecuencia de rate limiting
5. **Quota Usage**: Uso diario de la API

---

## 🎯 Implementación de Referencia

### API Route Completa

```typescript
// src/app/api/audit/pagespeed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL = 24 * 60 * 60; // 24 horas en segundos
const TIMEOUT_MS = 90 * 1000;
const RATE_LIMIT = 10;
const RATE_WINDOW = 3600; // 1 hora en segundos

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Validar y normalizar entrada
    const { url, strategy = 'mobile' } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'INVALID_URL', message: 'URL es requerida', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'INVALID_URL', message: 'URL no válida', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!isValidStrategy(strategy)) {
      return NextResponse.json(
        { error: 'INVALID_STRATEGY', message: 'Strategy debe ser mobile o desktop', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // 2. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `ratelimit:pagespeed:${ip}`;
    const count = await redis.incr(rateLimitKey);
    
    if (count === 1) {
      await redis.expire(rateLimitKey, RATE_WINDOW);
    }
    
    if (count > RATE_LIMIT) {
      const ttl = await redis.ttl(rateLimitKey);
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Límite de solicitudes excedido. Intenta más tarde.',
          code: 'QUOTA_EXCEEDED',
          retryAfter: ttl,
        },
        { status: 429 }
      );
    }

    // 3. Verificar Cache
    const cacheKey = `pagespeed:${normalizedUrl}:${strategy}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // 4. Llamar a PageSpeed API con timeout
    const apiKey = process.env.GOOGLE_PAGESPEED_INSIGHTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'CONFIG_ERROR', message: 'API key no configurada', code: 'MISSING_API_KEY' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // IMPORTANTE: PageSpeed API usa GET, no POST
      // Múltiples categorías se pasan como parámetros repetidos
      const apiUrl = new URL('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed');
      apiUrl.searchParams.set('url', normalizedUrl);
      apiUrl.searchParams.set('strategy', strategy);
      apiUrl.searchParams.set('key', apiKey);
      apiUrl.searchParams.append('category', 'PERFORMANCE');
      apiUrl.searchParams.append('category', 'SEO');
      
      const response = await fetch(apiUrl.toString(), {
        method: 'GET', // PageSpeed API usa GET, no POST
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          return NextResponse.json(
            {
              error: 'RATE_LIMIT_EXCEEDED',
              message: 'Límite de solicitudes excedido. Intenta más tarde.',
              code: 'QUOTA_EXCEEDED',
              retryAfter: retryAfter ? parseInt(retryAfter) : 3600,
            },
            { status: 429 }
          );
        }

        if (response.status === 401 || response.status === 403) {
          // NO exponer detalles de autenticación
          return NextResponse.json(
            {
              error: 'AUTHENTICATION_ERROR',
              message: 'Error de autenticación con el servicio.',
              code: 'API_KEY_INVALID',
            },
            { status: 500 }
          );
        }

        const errorData = await response.text();
        return NextResponse.json(
          {
            error: 'API_ERROR',
            message: 'Error al obtener datos de PageSpeed Insights.',
            code: 'GOOGLE_API_ERROR',
          },
          { status: response.status >= 500 ? 502 : response.status }
        );
      }

      const apiData = await response.json();
      
      // 5. Normalizar datos
      const normalizedData = normalizePageSpeedData(apiData, normalizedUrl, strategy);
      
      // 6. Guardar en cache
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(normalizedData));
      
      // 7. Logging
      const duration = Date.now() - startTime;
      logger.info('pagespeed_request_success', {
        url: normalizedUrl,
        strategy,
        duration,
        cached: false,
      });

      return NextResponse.json(normalizedData, {
        headers: {
          'X-Cache': 'MISS',
          'Cache-Control': 'public, max-age=86400',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'TIMEOUT_ERROR',
            message: 'La solicitud tardó demasiado. Intenta con una URL más simple.',
            code: 'REQUEST_TIMEOUT',
          },
          { status: 408 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('pagespeed_request_failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    });

    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Error interno del servidor. Intenta más tarde.',
        code: 'SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] Validación de URL robusta
- [ ] Manejo de todos los tipos de errores (400, 401, 403, 429, 408, 500, 502, 503)
- [ ] Rate limiting por IP/usuario
- [ ] Caching con Redis/Upstash (24 horas)
- [ ] Timeout configurado (90 segundos)
- [ ] Retry logic con exponential backoff
- [ ] Normalización de datos consistente
- [ ] Estados de UI (loading, error, success, empty)
- [ ] Logging estructurado
- [ ] Monitoreo de métricas
- [ ] Consistencia visual con el resto del sitio
- [ ] Mensajes de error amigables para el usuario
- [ ] No exponer detalles sensibles al cliente
- [ ] Usar método GET (no POST) para PageSpeed API
- [ ] Verificar quota actual en Google Cloud Console

---

## 📚 Referencias

- [Google PageSpeed Insights API v5 Docs](https://developers.google.com/speed/docs/insights/rest/v5)
- [Next.js API Routes Best Practices](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Error Handling Patterns](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Documentación oficial**: [Google PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed) (Última actualización: 2024-09-03 UTC)

### ✅ Verificación de Información (Nov 2025)

- ✅ **Endpoint confirmado**: `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed` (v5 es la versión actual)
- ✅ **Método HTTP**: `GET` (no POST)
- ✅ **Core Web Vitals**: INP reemplazó FID en marzo 2024 (información actualizada)
- ✅ **Categorías disponibles**: `PERFORMANCE`, `SEO`, `ACCESSIBILITY`, `BEST_PRACTICES`
- ✅ **Estrategias**: `MOBILE`, `DESKTOP`
- ⚠️ **Quota**: Verificar en [Google Cloud Console](https://console.cloud.google.com/) - puede variar según el plan

