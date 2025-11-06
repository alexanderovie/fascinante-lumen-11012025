'use client';

import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileText,
  Link2,
  MapPin,
  Search,
  Shield,
  Star,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import Noise from '@/components/noise';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/ui/donut-chart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AuditResultsProps {
  translations: {
    title: string;
    description: string;
    performance: {
      title: string;
      score: string;
      mobile: string;
      desktop: string;
    };
    coreWebVitals: {
      title: string;
      fcp: string;
      lcp: string;
      cls: string;
      inp: string;
      ttfb: string;
    };
    seo: {
      title: string;
      score: string;
      issues: string;
    };
    issues: {
      title: string;
      critical: string;
      warning: string;
      info: string;
      noIssues: string;
    };
  };
}

// Mock data - será reemplazado con datos reales mañana
const mockResults = {
  hasResults: true, // UI completa visible (sin lógica real aún)
  performance: {
    score: 85,
    mobile: 82,
    desktop: 88,
  },
  coreWebVitals: {
    fcp: { value: 1.2, rating: 'good' },
    lcp: { value: 2.1, rating: 'good' },
    cls: { value: 0.05, rating: 'good' },
    inp: { value: 150, rating: 'good' },
    ttfb: { value: 600, rating: 'good' },
  },
  seo: {
    score: 92,
    issues: 3,
  },
  issues: [
    { id: '1', title: 'Imágenes sin optimizar', severity: 'critical', impact: 'high' },
    { id: '2', title: 'Falta meta description', severity: 'warning', impact: 'medium' },
    { id: '3', title: 'Enlaces rotos detectados', severity: 'warning', impact: 'medium' },
  ],
  googleBusinessProfile: {
    score: 78,
    rating: 4.2,
    totalReviews: 45,
    completeness: 85,
    issues: [
      { id: 'gbp1', title: 'Faltan fotos del negocio', severity: 'warning' },
      { id: 'gbp2', title: 'Descripción incompleta', severity: 'warning' },
    ],
  },
  backlinks: {
    total: 127,
    quality: 85,
    domains: 42,
    dofollow: 98,
    nofollow: 29,
  },
  content: {
    pages: 24,
    wordCount: 12500,
    avgWordsPerPage: 520,
    readability: 72,
    issues: [
      { id: 'content1', title: 'Páginas con poco contenido', severity: 'warning' },
    ],
  },
  accessibility: {
    score: 88,
    issues: 2,
  },
  security: {
    score: 95,
    ssl: true,
    issues: 0,
  },
  recommendations: [
    {
      id: 'rec1',
      priority: 'high',
      title: 'Optimizar imágenes',
      description: 'Comprimir y redimensionar imágenes para mejorar velocidad de carga',
      impact: 'Alto impacto en Performance',
    },
    {
      id: 'rec2',
      priority: 'medium',
      title: 'Agregar meta descriptions',
      description: 'Añadir meta descriptions únicas a todas las páginas',
      impact: 'Mejora SEO y CTR',
    },
    {
      id: 'rec3',
      priority: 'high',
      title: 'Subir más fotos a Google Business',
      description: 'Agregar al menos 10 fotos de alta calidad del negocio',
      impact: 'Aumenta confianza y conversiones',
    },
  ],
  keywordOpportunities: [
    {
      id: 'kw1',
      keyword: 'servicios de limpieza tampa',
      searchVolume: 1200,
      difficulty: 35,
      opportunity: 'high',
      cpc: 2.5,
    },
    {
      id: 'kw2',
      keyword: 'limpieza comercial cerca de mí',
      searchVolume: 890,
      difficulty: 28,
      opportunity: 'high',
      cpc: 3.2,
    },
    {
      id: 'kw3',
      keyword: 'empresa de limpieza profesional',
      searchVolume: 650,
      difficulty: 42,
      opportunity: 'medium',
      cpc: 2.8,
    },
    {
      id: 'kw4',
      keyword: 'limpieza de oficinas tampa fl',
      searchVolume: 320,
      difficulty: 25,
      opportunity: 'high',
      cpc: 4.1,
    },
    {
      id: 'kw5',
      keyword: 'servicios de mantenimiento limpieza',
      searchVolume: 540,
      difficulty: 38,
      opportunity: 'medium',
      cpc: 2.3,
    },
  ],
};

export default function AuditResults({ translations }: AuditResultsProps) {
  const { hasResults } = mockResults;

  if (!hasResults) {
    return (
      <section className="section-padding relative">
        <Noise />
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-lg">
              {translations.description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingBadge = (rating: string) => {
    const variants = {
      good: { variant: 'default' as const, icon: CheckCircle2, className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
      'needs-improvement': { variant: 'secondary' as const, icon: AlertCircle, className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
      poor: { variant: 'destructive' as const, icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    };

    const config = variants[rating as keyof typeof variants] || variants.good;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={cn('gap-1.5', config.className)}>
        <Icon className="size-3" />
        {rating === 'good' ? 'Bueno' : rating === 'needs-improvement' ? 'Mejorable' : 'Pobre'}
      </Badge>
    );
  };

  return (
    <section className="section-padding relative">
      <Noise />
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl leading-tight tracking-tight lg:text-4xl">
            {translations.title}
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            {translations.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Score Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{translations.performance.title}</CardTitle>
                <TrendingUp className="text-primary size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <DonutChart
                  value={mockResults.performance.score}
                  size={100}
                  strokeWidth={10}
                  label="Score"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{translations.performance.mobile}</span>
                    <span className={cn('font-semibold', getScoreColor(mockResults.performance.mobile))}>
                      {mockResults.performance.mobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{translations.performance.desktop}</span>
                    <span className={cn('font-semibold', getScoreColor(mockResults.performance.desktop))}>
                      {mockResults.performance.desktop}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Score Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{translations.seo.title}</CardTitle>
                <CheckCircle2 className="text-primary size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <DonutChart
                  value={mockResults.seo.score}
                  size={100}
                  strokeWidth={10}
                  label="SEO"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{translations.seo.issues}:</span>
                    <Badge variant="secondary">{mockResults.seo.issues}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Web Vitals Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{translations.coreWebVitals.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {translations.coreWebVitals.fcp}
                  </div>
                  <div className="text-lg font-semibold">
                    {mockResults.coreWebVitals.fcp.value}s
                  </div>
                  {getRatingBadge(mockResults.coreWebVitals.fcp.rating)}
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {translations.coreWebVitals.lcp}
                  </div>
                  <div className="text-lg font-semibold">
                    {mockResults.coreWebVitals.lcp.value}s
                  </div>
                  {getRatingBadge(mockResults.coreWebVitals.lcp.rating)}
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {translations.coreWebVitals.cls}
                  </div>
                  <div className="text-lg font-semibold">
                    {mockResults.coreWebVitals.cls.value}
                  </div>
                  {getRatingBadge(mockResults.coreWebVitals.cls.rating)}
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {translations.coreWebVitals.inp}
                  </div>
                  <div className="text-lg font-semibold">
                    {mockResults.coreWebVitals.inp.value}ms
                  </div>
                  {getRatingBadge(mockResults.coreWebVitals.inp.rating)}
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {translations.coreWebVitals.ttfb}
                  </div>
                  <div className="text-lg font-semibold">
                    {mockResults.coreWebVitals.ttfb.value}ms
                  </div>
                  {getRatingBadge(mockResults.coreWebVitals.ttfb.rating)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{translations.issues.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {mockResults.issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="text-green-600 dark:text-green-400 mb-4 size-12" />
                  <p className="text-muted-foreground">{translations.issues.noIssues}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockResults.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border-input flex items-start gap-3 rounded-lg border p-4"
                    >
                      <div className="mt-0.5">
                        {issue.severity === 'critical' ? (
                          <XCircle className="text-red-600 dark:text-red-400 size-5" />
                        ) : (
                          <AlertCircle className="text-yellow-600 dark:text-yellow-400 size-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge
                            variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}
                          >
                            {issue.severity === 'critical'
                              ? translations.issues.critical
                              : translations.issues.warning}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Impacto: {issue.impact === 'high' ? 'Alto' : 'Medio'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Business Profile Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary size-5" />
                  Análisis de Google Business Profile
                </CardTitle>
                <Badge variant="secondary" className="gap-1.5">
                  <Star className="size-3 fill-yellow-500 text-yellow-500" />
                  {mockResults.googleBusinessProfile.rating}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center gap-3">
                  <DonutChart
                    value={mockResults.googleBusinessProfile.score}
                    size={120}
                    strokeWidth={12}
                    label="Puntuación"
                  />
                  <div className="text-muted-foreground text-center text-sm">Puntuación General</div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-4xl font-bold">
                    {mockResults.googleBusinessProfile.totalReviews}
                  </div>
                  <div className="text-muted-foreground text-center text-sm">Reseñas Totales</div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <DonutChart
                    value={mockResults.googleBusinessProfile.completeness}
                    size={120}
                    strokeWidth={12}
                    label="%"
                  />
                  <div className="text-muted-foreground text-center text-sm">Completitud del Perfil</div>
                </div>
              </div>
              {mockResults.googleBusinessProfile.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm font-medium">Problemas Detectados:</div>
                  <div className="space-y-2">
                    {mockResults.googleBusinessProfile.issues.map((issue) => (
                      <div key={issue.id} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="text-yellow-600 dark:text-yellow-400 size-4" />
                        <span>{issue.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backlinks Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="text-primary size-5" />
                  Análisis de Backlinks
                </CardTitle>
                <BarChart3 className="text-primary size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Total de Backlinks</span>
                  <span className="text-xl font-bold">{mockResults.backlinks.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Dominios Únicos</span>
                  <span className="text-xl font-bold">{mockResults.backlinks.domains}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Calidad</span>
                  <span className={cn('text-xl font-bold', getScoreColor(mockResults.backlinks.quality))}>
                    {mockResults.backlinks.quality}%
                  </span>
                </div>
                <div className="border-input mt-4 space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">DoFollow</span>
                    <span className="font-medium">{mockResults.backlinks.dofollow}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">NoFollow</span>
                    <span className="font-medium">{mockResults.backlinks.nofollow}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary size-5" />
                  Análisis de Contenido
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Páginas Analizadas</span>
                  <span className="text-xl font-bold">{mockResults.content.pages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Palabras Totales</span>
                  <span className="text-xl font-bold">{mockResults.content.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Promedio por Página</span>
                  <span className="text-xl font-bold">{mockResults.content.avgWordsPerPage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Legibilidad</span>
                  <span className={cn('text-xl font-bold', getScoreColor(mockResults.content.readability))}>
                    {mockResults.content.readability}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-primary size-5" />
                  Seguridad y Accesibilidad
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Puntuación de Accesibilidad</span>
                  <span className={cn('text-xl font-bold', getScoreColor(mockResults.accessibility.score))}>
                    {mockResults.accessibility.score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Puntuación de Seguridad</span>
                  <span className={cn('text-xl font-bold', getScoreColor(mockResults.security.score))}>
                    {mockResults.security.score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Certificado SSL</span>
                  <Badge variant={mockResults.security.ssl ? 'default' : 'destructive'} className="gap-1.5">
                    {mockResults.security.ssl ? (
                      <>
                        <CheckCircle2 className="size-3" />
                        Activo
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3" />
                        Inactivo
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Opportunities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="text-primary size-5" />
                Oportunidades de Palabras Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockResults.keywordOpportunities.map((kw) => (
                  <div
                    key={kw.id}
                    className="border-input flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{kw.keyword}</h4>
                        <Badge
                          variant={kw.opportunity === 'high' ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {kw.opportunity === 'high' ? (
                            <>
                              <TrendingUp className="size-3" />
                              Alta Oportunidad
                            </>
                          ) : (
                            <>
                              <AlertCircle className="size-3" />
                              Media Oportunidad
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Volumen:</span>
                          <span className="ml-2 font-medium">
                            {kw.searchVolume.toLocaleString()}/mes
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dificultad:</span>
                          <span className={cn('ml-2 font-medium', getScoreColor(100 - kw.difficulty))}>
                            {kw.difficulty}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CPC:</span>
                          <span className="ml-2 font-medium">${kw.cpc}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary size-5" />
                Recomendaciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResults.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border-input flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="mt-0.5">
                      {rec.priority === 'high' ? (
                        <XCircle className="text-red-600 dark:text-red-400 size-5" />
                      ) : (
                        <AlertCircle className="text-yellow-600 dark:text-yellow-400 size-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority === 'high' ? 'Alta Prioridad' : 'Media Prioridad'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">{rec.description}</p>
                      <p className="text-muted-foreground mt-2 text-xs font-medium">{rec.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
