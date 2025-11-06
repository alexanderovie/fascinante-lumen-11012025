# 🚀 Quick Start: Variables de Entorno (Elite 2025)

## ⚡ Setup Rápido (3 minutos)

### 1. Instalar Vercel CLI

```bash
pnpm add -D vercel
```

### 2. Login y Linkear Proyecto

```bash
npx vercel login
npx vercel link
```

### 3. Agregar Variables a Vercel

```bash
# Una por una
npx vercel env add GOOGLE_PLACES_API_KEY production preview development

# O todas de una vez
npx vercel env add GOOGLE_PLACES_API_KEY production preview development
npx vercel env add UPSTASH_REDIS_REST_URL production preview development
npx vercel env add UPSTASH_REDIS_REST_TOKEN production preview development
```

### 4. Sincronizar a Local

```bash
pnpm run env:pull
```

### 5. Verificar

```bash
pnpm run env:check
```

---

## 📋 Comandos Útiles

```bash
# Sincronizar variables desde Vercel
pnpm run env:pull

# Listar variables en Vercel
pnpm run env:ls

# Agregar nueva variable
pnpm run env:add VARIABLE_NAME production preview development

# Eliminar variable
pnpm run env:rm VARIABLE_NAME

# Verificar variables locales
pnpm run env:check
```

---

## 🎯 Workflow Diario

**Al iniciar desarrollo:**
```bash
pnpm run env:pull
```

**Al agregar nueva variable:**
```bash
# 1. Agregar en Vercel
pnpm run env:add NUEVA_VARIABLE production preview development

# 2. Sincronizar
pnpm run env:pull
```

---

## 📖 Documentación Completa

Para más detalles, consulta: [`docs/ENV_MANAGEMENT.md`](./ENV_MANAGEMENT.md)
