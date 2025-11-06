'use client';

import { FileSearch, Search } from 'lucide-react';
import { useRef, useState } from 'react';

import Noise from '@/components/noise';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGooglePlacesAutocomplete } from '@/hooks/useGooglePlacesAutocomplete';
import { cn } from '@/lib/utils';

interface AuditFormProps {
  translations: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    form: {
      title: string;
      description: string;
      businessNameLabel: string;
      businessNamePlaceholder: string;
      businessAddressLabel: string;
      businessAddressPlaceholder: string;
      businessPhoneLabel: string;
      businessPhonePlaceholder: string;
      websiteUrlLabel: string;
      websiteUrlPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      infoCardTitle: string;
      infoCardDescription: string;
      infoCardAnalysisTitle: string;
      infoCardItems: string[];
    };
  };
}

export default function AuditForm({ translations }: AuditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  // Estas variables se usarán cuando implementemos la funcionalidad completa de autocompletado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessAddress, setBusinessAddress] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessPhone, setBusinessPhone] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [websiteUrl, setWebsiteUrl] = useState('');

  const businessNameInputRef = useRef<HTMLInputElement>(null);

  // Hook de autocompletado (usando REST API moderna)
  const {
    isLoading,
    suggestions,
    showSuggestions,
    suggestionsRef,
    selectedIndex,
    itemRefs,
    handleSelectSuggestion,
    handleMouseEnter,
  } = useGooglePlacesAutocomplete({
    inputRef: businessNameInputRef,
    onSelect: (prediction) => {
      // Actualizar el estado cuando se selecciona una sugerencia
      const selectedText = prediction.structuredFormat?.mainText.text || prediction.text.text;
      setBusinessName(selectedText);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implementar lógica de auditoría mañana
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section className="section-padding relative">
      <Noise />
      <div className="container">
        {/* Section Header - Estándar industria: text-balance, sin saltos forzados */}
        <h2 className="text-3xl leading-tight tracking-tight font-semibold text-balance lg:text-5xl">
          {translations.hero.title} {translations.hero.subtitle}
        </h2>

        {/* Form Content - Mismo layout grid que FAQ */}
        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-3">
          {/* Form - Left Side (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">{translations.form.title}</h3>
                <CardDescription className="text-base">
                  {translations.form.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name Input - PRIMERO con autocompletado de Places */}
                  <div className="space-y-2">
                    <Label htmlFor="business-name" className="text-base">
                      {translations.form.businessNameLabel}
                    </Label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2" />
                      <Input
                        ref={businessNameInputRef}
                        id="business-name"
                        type="text"
                        placeholder={translations.form.businessNamePlaceholder}
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                        }}
                        required
                        className="h-11 pl-10 text-base"
                        autoComplete="off"
                        aria-autocomplete="list"
                        aria-expanded={showSuggestions}
                        aria-controls="business-name-suggestions"
                        aria-activedescendant={
                          selectedIndex >= 0
                            ? `suggestion-${selectedIndex}`
                            : undefined
                        }
                      />
                      {isLoading && (
                        <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 text-xs">
                          Cargando...
                        </span>
                      )}
                      {/* Dropdown de sugerencias - Mejorado UX Elite */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div
                          ref={suggestionsRef}
                          id="business-name-suggestions"
                          role="listbox"
                          className="absolute z-[100] mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border bg-background shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                          style={{
                            // Asegurar que esté por encima de todo pero NO bloquee el input
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            pointerEvents: 'auto', // Asegurar que los clicks funcionen
                          }}
                          onMouseDown={(e) => {
                            // Prevenir que el mousedown cierre las sugerencias
                            e.stopPropagation();
                          }}
                        >
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={suggestion.placeId || index}
                              id={`suggestion-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selectedIndex === index}
                              ref={(el) => {
                                itemRefs.current[index] = el;
                              }}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              onMouseEnter={() => handleMouseEnter(index)}
                              className={cn(
                                'w-full px-4 py-2.5 text-left transition-colors',
                                'hover:bg-muted focus:bg-muted focus:outline-none',
                                selectedIndex === index && 'bg-muted',
                                index === 0 && 'rounded-t-md',
                                index === suggestions.length - 1 && 'rounded-b-md',
                              )}
                            >
                              <div className="font-medium text-sm">
                                {suggestion.structuredFormat?.mainText.text ||
                                  suggestion.text.text}
                              </div>
                              {suggestion.structuredFormat?.secondaryText && (
                                <div className="text-muted-foreground mt-0.5 text-xs">
                                  {suggestion.structuredFormat.secondaryText.text}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Address - Se llena automáticamente cuando seleccionan negocio */}
                  <div className="space-y-2">
                    <Label htmlFor="business-address" className="text-base">
                      {translations.form.businessAddressLabel}
                    </Label>
                    <Input
                      id="business-address"
                      type="text"
                      placeholder={translations.form.businessAddressPlaceholder}
                      value={businessAddress}
                      readOnly
                      className="h-11 text-base bg-muted/50"
                    />
                  </div>

                  {/* Business Phone - Se llena automáticamente cuando seleccionan negocio */}
                  <div className="space-y-2">
                    <Label htmlFor="business-phone" className="text-base">
                      {translations.form.businessPhoneLabel}
                    </Label>
                    <Input
                      id="business-phone"
                      type="tel"
                      placeholder={translations.form.businessPhonePlaceholder}
                      value={businessPhone}
                      readOnly
                      className="h-11 text-base bg-muted/50"
                    />
                  </div>

                  {/* Website URL - Se llena automáticamente si el negocio tiene website */}
                  <div className="space-y-2">
                    <Label htmlFor="website-url" className="text-base">
                      {translations.form.websiteUrlLabel}
                    </Label>
                    <Input
                      id="website-url"
                      type="url"
                      placeholder={translations.form.websiteUrlPlaceholder}
                      value={websiteUrl}
                      readOnly
                      className="h-11 text-base bg-muted/50"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !businessName}
                  >
                    {isSubmitting
                      ? translations.form.submittingButton
                      : translations.form.submitButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Card - Right Side (mismo estilo que FAQ card) */}
          <Card className="hover:shadow-primary/5 h-full gap-6 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="gap-6 md:gap-8 lg:gap-11">
              <FileSearch className="text-secondary size-18 stroke-1 md:size-20" />

              <h3 className="text-2xl">{translations.form.infoCardTitle}</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{translations.form.infoCardDescription}</p>
            </CardContent>
            <CardFooter className="mt-auto justify-self-end">
              <div className="text-muted-foreground space-y-2 text-sm">
                <p className="font-medium">{translations.form.infoCardAnalysisTitle}</p>
                <ul className="space-y-1 list-disc list-inside">
                  {translations.form.infoCardItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
