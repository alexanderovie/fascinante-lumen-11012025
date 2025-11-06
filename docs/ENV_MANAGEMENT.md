# 🔐 Gestión Elite de Variables de Entorno (Nov 2025)

Guía completa sobre las mejores prácticas modernas para gestionar variables de entorno en Vercel, siguiendo estándares de la industria 2025.

---

## 🎯 Estrategia Recomendada: **Vercel CLI + Sincronización Automática**

### **Flujo Elite (Recomendado para 2025):**

1. **Desarrollo Local**: `.env.local` (nunca se commitea)
2. **Vercel Production**: Variables gestionadas vía CLI o Dashboard
3. **Sincronización**: `vercel env pull` para mantener `.env.local` actualizado
4. **Automatización**: Scripts npm para facilitar el workflow

---

## 📋 Métodos de Gestión (Orden de Preferencia)

### **1. Vercel CLI (⭐ ELITE - Recomendado para 2025)**

**Ventajas:**
- ✅ Versionable (scripts en package.json)
- ✅ Automatizable
- ✅ Consistente entre desarrolladores
- ✅ Integrable con CI/CD
- ✅ No requiere acceso al Dashboard

**Instalación:**
```bash
pnpm add -D vercel
# O globalmente:
pnpm add -g vercel
```

**Comandos Principales:**

```bash
# Login (una vez)
vercel login

# Agregar variable de entorno
vercel env add GOOGLE_PLACES_API_KEY production preview development

# Listar variables
vercel env ls

# Eliminar variable
vercel env rm GOOGLE_PLACES_API_KEY

# Sincronizar variables de Vercel a .env.local
vercel env pull .env.local
```

**Scripts en `package.json`:**

```json
{
  "scripts": {
    "env:pull": "vercel env pull .env.local",
    "env:add": "vercel env add",
    "env:ls": "vercel env ls",
    "env:rm": "vercel env rm"
  }
}
```

---

### **2. GitHub Actions (⭐ ELITE - Para CI/CD Automatizado)**

**Cuándo usar:**
- Proyectos con múltiples entornos
- Equipos grandes
- Necesitas sincronización automática
- Quieres auditoría de cambios

**Ejemplo de Workflow:**

```yaml
# .github/workflows/sync-env.yml
name: Sync Environment Variables

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 0' # Semanal

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Vercel CLI
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Pull Environment Variables
        run: vercel env pull .env.local

      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .env.local
          git commit -m "chore: sync env vars from Vercel" || exit 0
          git push
```

---

### **3. Vercel Dashboard (✅ Válido pero Menos Elite)**

**Cuándo usar:**
- Configuración inicial rápida
- Cambios puntuales
- No tienes CLI instalada

**Pasos:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega variables manualmente
4. Selecciona entornos (Production, Preview, Development)

**⚠️ Desventajas:**
- No es versionable
- Difícil de automatizar
- Propenso a errores humanos
- No hay historial de cambios

---

## 🚀 Setup Inicial (Workflow Elite)

### **Paso 1: Instalar Vercel CLI**

```bash
pnpm add -D vercel
```

### **Paso 2: Login**

```bash
npx vercel login
```

### **Paso 3: Linkear Proyecto**

```bash
npx vercel link
```

### **Paso 4: Agregar Variables**

```bash
# Una por una
npx vercel env add GOOGLE_PLACES_API_KEY production preview development

# O usando un script
pnpm run env:add GOOGLE_PLACES_API_KEY
```

### **Paso 5: Sincronizar a Local**

```bash
npx vercel env pull .env.local
```

---

## 📝 Scripts Recomendados para `package.json`

```json
{
  "scripts": {
    "env:pull": "vercel env pull .env.local",
    "env:push": "node scripts/push-env.js",
    "env:sync": "vercel env pull .env.local && echo '✅ Variables sincronizadas'",
    "env:add": "vercel env add",
    "env:ls": "vercel env ls",
    "env:rm": "vercel env rm",
    "env:check": "node scripts/check-env.js"
  }
}
```

---

## 🔄 Workflow Diario Recomendado

### **Al Iniciar Desarrollo:**

```bash
# Sincronizar variables de Vercel a local
pnpm run env:pull
```

### **Al Agregar Nueva Variable:**

```bash
# 1. Agregar en Vercel
pnpm run env:add VARIABLE_NAME production preview development

# 2. Sincronizar a local
pnpm run env:pull
```

### **Al Cambiar Variable:**

```bash
# 1. Eliminar la antigua
pnpm run env:rm VARIABLE_NAME

# 2. Agregar la nueva
pnpm run env:add VARIABLE_NAME production preview development

# 3. Sincronizar
pnpm run env:pull
```

---

## 🛡️ Seguridad y Mejores Prácticas

### **1. Separación de Entornos**

```bash
# Variables solo para producción
vercel env add SECRET_KEY production

# Variables para todos los entornos
vercel env add API_URL production preview development
```

### **2. Variables Públicas vs Privadas**

```bash
# ❌ NUNCA pongas secretos en NEXT_PUBLIC_*
NEXT_PUBLIC_API_URL=https://api.example.com  # ✅ OK (público)

# ✅ Secretos sin prefijo
GOOGLE_PLACES_API_KEY=secret_key_here  # ✅ OK (privado)
```

### **3. Validación de Variables**

Crea un script `scripts/check-env.js`:

```javascript
// scripts/check-env.js
const required = [
  'GOOGLE_PLACES_API_KEY',
  // Agrega más variables requeridas
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Variables faltantes:', missing.join(', '));
  process.exit(1);
}

console.log('✅ Todas las variables están configuradas');
```

---

## 📊 Comparación de Métodos (2025)

| Método | Versionable | Automatizable | Consistencia | Facilidad | ⭐ Rating |
|--------|------------|---------------|--------------|-----------|-----------|
| **Vercel CLI** | ✅ | ✅ | ✅✅✅ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **GitHub Actions** | ✅✅ | ✅✅✅ | ✅✅✅ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Dashboard** | ❌ | ❌ | ⚠️ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Copiar/Pegar** | ❌ | ❌ | ❌ | ⭐⭐⭐ | ⭐ |

---

## 🎓 Ejemplo Completo: Setup del Proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Instalar Vercel CLI (si no está global)
pnpm add -D vercel

# 3. Login en Vercel
npx vercel login

# 4. Linkear proyecto
npx vercel link

# 5. Agregar todas las variables necesarias
npx vercel env add GOOGLE_PLACES_API_KEY production preview development
npx vercel env add UPSTASH_REDIS_REST_URL production preview development
npx vercel env add UPSTASH_REDIS_REST_TOKEN production preview development

# 6. Sincronizar a .env.local
pnpm run env:pull

# 7. Verificar que todo está bien
pnpm run env:check
```

---

## 🔗 Referencias

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions for Vercel](https://github.com/marketplace/actions/vercel-action)

---

## ✅ Checklist de Implementación

- [ ] Vercel CLI instalado
- [ ] Proyecto linkeado (`vercel link`)
- [ ] Variables agregadas vía CLI
- [ ] `.env.local` sincronizado (`vercel env pull`)
- [ ] Scripts npm configurados
- [ ] `.env.local` en `.gitignore`
- [ ] Documentación actualizada (`ENV_SETUP.md`)

---

**Última actualización:** Noviembre 2025
**Estándar:** Vercel CLI + Sincronización Automática
