'use client';

import { ChevronRightIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import Noise from '@/components/noise';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

const faqData = [
  {
    id: 'system-who-is-it-for',
    question: 'What is Fascinante Digital and who is it for?',
    answer:
      'We are a digital marketing agency specializing in automated local visibility management for businesses, managers, and marketers who want to grow online presence without manual work.',
  },
  {
    id: 'technical-knowledge',
    question: 'Can I work with Fascinante Digital without technical knowledge?',
    answer:
      'Absolutely! Our agency services are designed with simplicity in mind. We handle optimizing listings, managing reviews, and growing visibility so you don\'t need any technical background. Our team makes it easy for anyone to get started.',
  },
  {
    id: 'speed-results',
    question: 'How do you achieve results so quickly?',
    answer:
      'We use modern enterprise-level technology with special access and permissions that required years of development and strategic partnerships. Our advanced automation infrastructure enables instant updates and managed services that most agencies cannot access.',
  },
  {
    id: 'automation',
    question: 'How does automated management work?',
    answer:
      'Our expert team uses modern technology to build custom business automations. We create intelligent workflows that automatically update listings, respond to reviews, publish content, and optimize visibility based on your defined criteria and local market data.',
  },
  {
    id: 'security-compliance',
    question: 'Is Fascinante Digital secure and compliant?',
    answer:
      'Security is our top priority. Our agency uses enterprise-grade security features including end-to-end encryption, SOC 2 Type II compliance, GDPR compliance, and regular security audits. Your data is protected with industry-standard security protocols.',
  },
];

export default function FAQSection() {
  return (
    <section className="section-padding relative">
      <Noise />
      <div className="container">
        {/* Section Header */}
        <h2 className="text-3xl leading-tight tracking-tight font-semibold lg:text-5xl">
          Frequently <br className="hidden md:block" />
          asked questions:
        </h2>

        {/* FAQ Content */}
        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-3">
          {/* FAQ Accordion - Left Side */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-input hover:shadow-primary/5 rounded-lg !border px-6 py-2 transition-all duration-300 hover:shadow-md"
                >
                  <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline md:text-lg lg:text-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="hover:shadow-primary/5 h-full gap-6 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="gap-6 md:gap-8 lg:gap-11">
              <MessageSquare className="text-secondary size-18 stroke-1 md:size-20" />

              <h3 className="text-2xl">Still have questions?</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">
                Let&apos;s talk. Our team is here to help you make the most of
                our system. Whether it&apos;s onboarding, integration, or support.
              </p>
            </CardContent>
            <CardFooter className="mt-auto justify-self-end">
              <Button
                size="lg"
                variant="light"
                className="group h-12 w-full gap-4"
                asChild
              >
                <Link href="/contact">
                  Contact With Us
                  <div className="bg-border border-input grid size-5.5 place-items-center rounded-full border">
                    <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.25" />
                  </div>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
