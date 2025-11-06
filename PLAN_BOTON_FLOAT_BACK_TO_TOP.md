# 🎯 Plan Elite: Botón Flotante "Back to Top"

## 📋 Análisis UX/UI - Noviembre 2025

### Características Elite Requeridas:

#### 1. **Comportamiento de Visibilidad** ⭐
- **Aparece**: Solo cuando el usuario hace scroll hacia abajo > 400px
- **Desaparece**: Automáticamente cuando está en el top (< 100px)
- **Transición**: Fade in/out suave (opacity 0 → 1) + scale (0.9 → 1)
- **Duración**: 200-300ms para no ser intrusivo

#### 2. **Posicionamiento** 📍
- **Posición**: `fixed` bottom-right
- **Offset**:
  - Desktop: `bottom: 2rem` (32px), `right: 2rem` (32px)
  - Mobile: `bottom: 1.5rem` (24px), `right: 1.5rem` (24px)
- **Z-index**: `z-40` (debajo del navbar `z-50`, pero visible)
- **Responsive**: Ajuste de tamaño y posición según breakpoint

#### 3. **Diseño Visual** 🎨
- **Estilo**: Consistente con botones CTA actuales
- **Variant**: `default` (fondo negro con efectos hover)
- **Tamaño**:
  - Desktop: `size-12` (48px) - Touch target mínimo 44x44px ✅
  - Mobile: `size-11` (44px) - Cumple WCAG 2.2 AA
- **Icono**: `ArrowUp` de lucide-react (size-5)
- **Bordes**: `rounded-full` (círculo perfecto)
- **Sombra**: `shadow-xl` con `hover:shadow-2xl` (efecto hover mejorado)

#### 4. **Interacciones** 🖱️
- **Hover**:
  - Scale: `hover:scale-[1.05]` (sutil, no exagerado)
  - Shadow: `hover:shadow-2xl`
  - Background: `hover:bg-primary/90`
- **Active**: `active:scale-[0.98]` (feedback táctil)
- **Click**: Smooth scroll al top con `behavior: 'smooth'`

#### 5. **Accesibilidad** ♿
- **Aria-label**: `aria-label="Volver al inicio"` / `"Back to top"`
- **Role**: `button` (implícito)
- **Keyboard**: Navegable con Tab, activable con Enter/Space
- **Focus visible**: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Reduced Motion**: Respetar `prefers-reduced-motion` (sin animaciones si está activo)

#### 6. **Performance** ⚡
- **Scroll listener**: Usar `requestAnimationFrame` para throttling
- **Cleanup**: Remover listeners en unmount
- **Debounce**: 100ms para evitar re-renders excesivos
- **SSR safe**: Verificar `window` antes de usar

#### 7. **Integración con UI Actual** 🔗
- **Tecnologías**:
  - Motion (ya instalado) para animaciones avanzadas
  - Tailwind CSS para estilos
  - Button component existente como base
  - usePrefersReducedMotion hook existente
- **Consistencia**:
  - Mismos colores y efectos que botones CTA
  - Mismo sistema de transiciones
  - Mismo patrón de z-index

#### 8. **Consideraciones Especiales** 🎯
- **No mostrar en**:
  - Páginas de auth (`/signin`, `/signup`, `/forgot-password`)
  - Páginas de error (`/not-found`)
- **Smooth scroll**: Usar `window.scrollTo({ top: 0, behavior: 'smooth' })`
- **Fallback**: Si `behavior: 'smooth'` no está soportado, usar animación manual con `requestAnimationFrame`

## 📐 Estructura del Componente

```tsx
'use client'

import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

interface BackToTopProps {
  className?: string
}

export default function BackToTop({ className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Thresholds
  const SCROLL_THRESHOLD = 400 // Aparece después de 400px
  const HIDE_THRESHOLD = 100   // Desaparece antes de 100px

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found']
  const shouldHide = hideOnPages.some((page) => pathname.includes(page))

  useEffect(() => {
    if (shouldHide || typeof window === 'undefined') return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop

          // Aparece si scroll > 400px, desaparece si < 100px
          setIsVisible(scrollTop > SCROLL_THRESHOLD && scrollTop >= HIDE_THRESHOLD)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldHide])

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (shouldHide) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={prefersReducedMotion ? false : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-8 right-8 z-40',
            'md:bottom-8 md:right-8',
            className,
          )}
        >
          <Button
            size="icon"
            variant="default"
            onClick={scrollToTop}
            className={cn(
              'size-11 rounded-full shadow-xl',
              'md:size-12',
              'hover:scale-105',
              'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            )}
            aria-label="Volver al inicio"
          >
            <ArrowUp className="size-5" strokeWidth={2.1} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## ✅ Checklist de Implementación

- [ ] Crear componente `BackToTop` en `src/components/common/back-to-top.tsx`
- [ ] Integrar en `src/app/[lang]/layout.tsx` (a nivel global)
- [ ] Agregar traducciones i18n para `aria-label`
- [ ] Verificar que funciona en todas las páginas
- [ ] Testear en diferentes dispositivos (mobile, tablet, desktop)
- [ ] Verificar accesibilidad (keyboard navigation, screen readers)
- [ ] Verificar performance (scroll throttling)
- [ ] Testear con `prefers-reduced-motion` activado
- [ ] Build y verificar sin errores

## 🎨 Características Destacadas

1. **No intrusivo**: Solo aparece cuando es necesario (> 400px scroll)
2. **Accesible**: WCAG 2.2 AA compliant, keyboard navigable
3. **Performante**: Throttling con `requestAnimationFrame`
4. **Consistente**: Usa el mismo sistema de diseño que el resto de la UI
5. **Suave**: Animaciones sutiles que no distraen
6. **Responsive**: Se adapta a diferentes tamaños de pantalla
7. **Inteligente**: Se oculta en páginas donde no tiene sentido
