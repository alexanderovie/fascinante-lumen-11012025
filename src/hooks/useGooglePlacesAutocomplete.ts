'use client';

import { useCallback,useEffect, useRef, useState } from 'react';

interface PlacePrediction {
  placeId: string;
  text: {
    text: string;
  };
  structuredFormat?: {
    mainText: {
      text: string;
    };
    secondaryText: {
      text: string;
    };
  };
}

interface AutocompleteSuggestion {
  placePrediction?: PlacePrediction;
}

interface UseGooglePlacesAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  apiKey?: string;
  onSelect?: (prediction: PlacePrediction) => void;
}

export function useGooglePlacesAutocomplete({
  inputRef,
  onSelect,
}: UseGooglePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Cerrar sugerencias al hacer clic fuera (usando mousedown en lugar de click para mejor UX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // No cerrar si el click es en el input o en las sugerencias
      if (
        inputRef.current?.contains(target) ||
        suggestionsRef.current?.contains(target)
      ) {
        return;
      }

      // Cerrar solo si el click es fuera de ambos
      setShowSuggestions(false);
      setSelectedIndex(-1);
    };

    // Usar mousedown en lugar de click para mejor UX (no interfiere con focus)
    // Y NO usar capture: true para evitar bloquear eventos del input
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/places/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      const predictions = data.suggestions
        ?.map((s: AutocompleteSuggestion) => s.placePrediction)
        .filter((p: PlacePrediction | undefined): p is PlacePrediction => p !== undefined) || [];

      setSuggestions(predictions);
      setShowSuggestions(predictions.length > 0);
      setSelectedIndex(-1); // Reset selection cuando hay nuevas sugerencias
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectSuggestion = useCallback(
    (prediction: PlacePrediction) => {
      if (inputRef.current) {
        const selectedText =
          prediction.structuredFormat?.mainText.text || prediction.text.text;

        // Llamar callback PRIMERO para actualizar el estado de React
        // Esto es crítico para inputs controlados
        if (onSelect) {
          onSelect(prediction);
        }

        // Luego actualizar el valor del input directamente (para sincronización)
        // Pero el estado de React ya se actualizó via onSelect
        inputRef.current.value = selectedText;

        // Disparar evento 'change' para sincronizar completamente con React
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', {
          writable: false,
          value: inputRef.current,
        });
        inputRef.current.dispatchEvent(changeEvent);

        // Mantener foco en el input después de seleccionar
        // Usar setTimeout para asegurar que el foco se mantenga después de la actualización
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    },
    [inputRef, onSelect],
  );

  // Manejo de input con debounce mejorado (200ms para mejor respuesta)
  // IMPORTANTE: Este hook NO debe interferir con la escritura normal del input
  // Solo escucha cambios para hacer fetch de sugerencias
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Usar un MutationObserver o simplemente escuchar cambios en el valor
    // Pero NO interferir con eventos de teclado normales
    const handleInput = () => {
      const value = input.value;

      // NO hacer preventDefault ni stopPropagation - dejar que React maneje el input normalmente
      // Solo escuchar el valor para hacer fetch de sugerencias

      // Mantener sugerencias visibles mientras escribe
      if (value.trim().length >= 2) {
        // Debounce reducido a 200ms para mejor UX
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          fetchSuggestions(value);
        }, 200);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const handleFocus = () => {
      // Mostrar sugerencias si hay texto y sugerencias disponibles
      if (input.value.trim().length >= 2 && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // CRÍTICO: Solo interceptar teclas de navegación, NUNCA teclas de escritura
      // Las teclas de escritura (letras, números, espacios, etc.) deben pasar sin interferencia

      // Si NO hay sugerencias visibles, solo interceptar ArrowDown para cargar sugerencias
      if (!showSuggestions || suggestions.length === 0) {
        if (e.key === 'ArrowDown' && input.value.trim().length >= 2) {
          // Si presiona flecha abajo y hay texto, intentar cargar sugerencias
          e.preventDefault();
          fetchSuggestions(input.value);
        }
        // Para TODAS las demás teclas (incluyendo letras, números, etc.), NO hacer nada
        // Dejar que el input y React las manejen normalmente
        return;
      }

      // Solo interceptar teclas de navegación cuando hay sugerencias visibles
      // NUNCA interceptar teclas de escritura (letras, números, espacios, etc.)
      const navigationKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
      if (!navigationKeys.includes(e.key)) {
        // No es una tecla de navegación, dejar que pase normalmente
        return;
      }

      // Solo llegar aquí si es una tecla de navegación Y hay sugerencias
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < suggestions.length - 1 ? prev + 1 : prev;
            // Scroll al item seleccionado
            itemRefs.current[next]?.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
            return next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : -1;
            if (next >= 0) {
              itemRefs.current[next]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
              });
            }
            return next;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          input.blur();
          break;
      }
    };

    // Escuchar eventos de input (cuando el usuario escribe)
    // Usar 'input' event que se dispara cuando cambia el valor
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', handleFocus);
    // Escuchar keydown SOLO para navegación, NO para escritura
    input.addEventListener('keydown', handleKeyDown);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('keydown', handleKeyDown);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputRef, fetchSuggestions, showSuggestions, suggestions, selectedIndex, handleSelectSuggestion]);

  // Resetear itemRefs cuando cambian las sugerencias
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, suggestions.length);
  }, [suggestions.length]);

  const handleMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    isLoading,
    suggestions,
    showSuggestions,
    suggestionsRef,
    selectedIndex,
    itemRefs,
    handleSelectSuggestion,
    handleMouseEnter,
  };
}
