
"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Bot, Mail, Phone } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export function HelpCenter() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('help.faq1.question'),
      answer: t('help.faq1.answer'),
    },
    {
      question: t('help.faq2.question'),
      answer: t('help.faq2.answer'),
    },
    {
      question: t('help.faq3.question'),
      answer: t('help.faq3.answer'),
    },
    {
      question: t('help.faq4.question'),
      answer: t('help.faq4.answer'),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-primary" />
          {t('help.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          {t('help.description')}
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('help.contact')}</CardTitle>
            <CardDescription>{t('help.contactDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                    <p className="font-semibold">{t('help.emailSupport')}</p>
                    <a href="mailto:support@agriassistsms.farm" className="text-sm text-muted-foreground hover:underline">
                        support@agriassistsms.farm
                    </a>
                </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                    <p className="font-semibold">{t('help.phoneSupport')}</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('help.faq')}</CardTitle>
            <CardDescription>
              {t('help.faqDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
