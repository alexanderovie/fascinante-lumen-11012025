# 🚀 Pasos para Agregar Variables a Vercel (Oficial Nov 2025)

## 📋 Según Documentación Oficial de Vercel

### **Sintaxis Correcta:**

```bash
# Agregar a TODOS los entornos (production, preview, development)
vercel env add [name]

# Agregar a un entorno específico
vercel env add [name] [environment]
# environment puede ser: production, preview, o development
```

---

## ✅ Pasos para tu Proyecto

### **Paso 4: Agregar Variables**

Según tu `.env.local`, necesitas agregar:

```bash
# Variable principal (la que tienes en .env.local)
npx vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

# O si prefieres usar GOOGLE_PLACES_API_KEY (recomendado para server-side)
npx vercel env add GOOGLE_PLACES_API_KEY
```

**⚠️ Importante:**
- El comando te pedirá el valor interactivamente
- Ingresa el valor de tu API key cuando se solicite
- Si agregas `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`, se expondrá al cliente (menos seguro)
- Si agregas `GOOGLE_PLACES_API_KEY` (sin `NEXT_PUBLIC_`), solo estará en el servidor (más seguro)

### **Paso 5: Sincronizar a Local**

```bash
pnpm run env:pull
```

O directamente:

```bash
npx vercel env pull .env.local
```

---

## 🔍 Verificar Variables Agregadas

```bash
# Listar todas las variables
npx vercel env ls

# Listar variables de un entorno específico
npx vercel env ls production
npx vercel env ls preview
npx vercel env ls development
```

---

## 💡 Recomendación

**Para tu caso específico:**

Como tu API route usa:
```typescript
process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
```

**Opción 1 (Recomendada - Más Segura):**
```bash
npx vercel env add GOOGLE_PLACES_API_KEY
# Ingresa tu API key cuando se solicite
```

**Opción 2 (Si prefieres mantener NEXT_PUBLIC_):**
```bash
npx vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
# Ingresa tu API key cuando se solicite
```

---

## 📚 Referencia Oficial

- [Vercel CLI env docs](https://vercel.com/docs/cli/env)
- [Managing Environment Variables](https://vercel.com/docs/environment-variables/managing-environment-variables)
- Última actualización: Septiembre 24, 2025
