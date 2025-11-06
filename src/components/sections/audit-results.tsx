'use client';

import { AlertCircle, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';

import Noise from '@/components/noise';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
              <div className="flex items-baseline gap-2">
                <span className={cn('text-4xl font-bold', getScoreColor(mockResults.performance.score))}>
                  {mockResults.performance.score}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{translations.performance.mobile}</span>
                  <span className={getScoreColor(mockResults.performance.mobile)}>
                    {mockResults.performance.mobile}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{translations.performance.desktop}</span>
                  <span className={getScoreColor(mockResults.performance.desktop)}>
                    {mockResults.performance.desktop}
                  </span>
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
              <div className="flex items-baseline gap-2">
                <span className={cn('text-4xl font-bold', getScoreColor(mockResults.seo.score))}>
                  {mockResults.seo.score}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{translations.seo.issues}:</span>
                <Badge variant="secondary">{mockResults.seo.issues}</Badge>
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
        </div>
      </div>
    </section>
  );
}
