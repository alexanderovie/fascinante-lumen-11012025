'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

interface PlaceDetails {
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
}

interface UseGooglePlacesAutocompleteProps {
  inputValue: string; // Valor del input controlado por React
  onSelect?: (prediction: PlacePrediction, details?: PlaceDetails) => void;
}

export function useGooglePlacesAutocomplete({
  inputValue,
  onSelect,
}: UseGooglePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch sugerencias cuando cambia el valor del input (con debounce)
  useEffect(() => {
    // Limpiar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Si el input tiene menos de 2 caracteres, limpiar sugerencias
    if (!inputValue || inputValue.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: inputValue.trim() }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        const predictions = data.suggestions
          ?.map((s: AutocompleteSuggestion) => s.placePrediction)
          .filter(
            (p: PlacePrediction | undefined): p is PlacePrediction =>
              p !== undefined,
          ) || [];

        setSuggestions(predictions);
        setShowSuggestions(predictions.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // NO cerrar si el click es en las sugerencias
      if (suggestionsRef.current?.contains(target)) {
        return;
      }

      setShowSuggestions(false);
      setSelectedIndex(-1);
    };

    // Usar 'click' en lugar de 'mousedown' para evitar cerrar antes del click en sugerencia
    // Y usar un pequeño delay para asegurar que el click en la sugerencia se procese primero
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      // Cerrar sugerencias PRIMERO para evitar re-renders innecesarios
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedIndex(-1);

      // Obtener detalles del lugar usando Place Details API (estándar de la industria)
      let placeDetails: PlaceDetails | undefined;
      if (prediction.placeId) {
        try {
          setIsLoading(true);
          const response = await fetch('/api/places/details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ placeId: prediction.placeId }),
          });

          if (response.ok) {
            const data = await response.json();
            placeDetails = {
              formattedAddress: data.formattedAddress,
              nationalPhoneNumber: data.nationalPhoneNumber || data.internationalPhoneNumber,
              websiteUri: data.websiteUri,
            };
          } else {
            const errorData = await response.text();
            console.error('Error en Place Details API:', errorData);
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
          // Continuar sin detalles si falla (no crítico)
        } finally {
          setIsLoading(false);
        }
      }

      // Llamar callback para actualizar el estado de React
      // El callback actualiza businessName y otros campos en el componente padre
      if (onSelect) {
        onSelect(prediction, placeDetails);
      }
    },
    [onSelect],
  );

  // Manejo de teclado (solo navegación, NO escritura)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Si NO hay sugerencias, dejar que todas las teclas pasen normalmente
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      // Solo interceptar teclas de navegación
      const navigationKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
      if (!navigationKeys.includes(e.key)) {
        return;
      }

      e.preventDefault();

      switch (e.key) {
        case 'ArrowDown':
          setSelectedIndex((prev) => {
            const next = prev < suggestions.length - 1 ? prev + 1 : prev;
            itemRefs.current[next]?.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
            return next;
          });
          break;
        case 'ArrowUp':
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
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSelectSuggestion],
  );

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
    handleKeyDown, // Exportar para usar en el componente
  };
}
