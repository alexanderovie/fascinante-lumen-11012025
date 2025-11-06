# 📚 Documentación Oficial i18n - Tecnologías Usadas

## 🛠️ Tecnologías que Estamos Usando

### 1. **@formatjs/intl-localematcher** (v0.6.2)
**Qué hace**: Matchea el idioma del navegador con nuestros locales soportados

**Documentación Oficial**:
- 📖 **NPM**: https://www.npmjs.com/package/@formatjs/intl-localematcher
- 📖 **FormatJS Docs**: https://formatjs.io/docs/packages/intl-localematcher/
- 📖 **GitHub**: https://github.com/formatjs/formatjs/tree/main/packages/intl-localematcher

**Uso en nuestro código**:
```typescript
import { match } from '@formatjs/intl-localematcher';

// Matchea idiomas del navegador con nuestros locales
return match(languages, locales, defaultLocale);
```

---

### 2. **negotiator** (v1.0.0)
**Qué hace**: Parsea el header `Accept-Language` del navegador

**Documentación Oficial**:
- 📖 **NPM**: https://www.npmjs.com/package/negotiator
- 📖 **GitHub**: https://github.com/jshttp/negotiator
- 📖 **README**: https://github.com/jshttp/negotiator#readme

**Uso en nuestro código**:
```typescript
import Negotiator from 'negotiator';

// Parsea Accept-Language header
const languages = new Negotiator({ headers }).languages();
```

---

### 3. **Next.js 15.5.6** (App Router)
**Qué hace**: Middleware y routing para i18n

**Documentación Oficial**:
- 📖 **Next.js i18n Guide**: https://nextjs.org/docs/app/building-your-application/routing/internationalization
- 📖 **Middleware API**: https://nextjs.org/docs/app/api-reference/middleware
- 📖 **App Router**: https://nextjs.org/docs/app

---

## 🔗 Referencias Rápidas

### Para Debuggear Problemas de Detección:

1. **@formatjs/intl-localematcher**
   - Ver cómo funciona el matching: https://formatjs.io/docs/packages/intl-localematcher/
   - Ejemplos de uso en GitHub

2. **negotiator**
   - Ver cómo parsea Accept-Language: https://github.com/jshttp/negotiator#accept-language-negotiation
   - Ejemplo: `negotiator.languages()` devuelve array ordenado por preferencia

3. **Next.js 15**
   - Guía oficial de i18n: https://nextjs.org/docs/app/building-your-application/routing/internationalization
   - Ejemplo oficial que estamos siguiendo

---

## 📝 Notas Importantes

- ✅ **Estas son las mismas librerías** que usa `next-intl` internamente
- ✅ **Recomendadas por Next.js** en su documentación oficial
- ✅ **Ligeras y eficientes** (no necesitamos librería completa como next-intl)
- ✅ **Control total** sobre la implementación

---

## 🎯 Si Necesitas Más Features

Si en el futuro necesitas:
- Formatting de fechas/números
- Pluralization avanzada
- Traducciones más complejas

Entonces considera migrar a **next-intl**:
- 📖 Docs: https://next-intl-docs.vercel.app/
- 📖 GitHub: https://github.com/amannn/next-intl
