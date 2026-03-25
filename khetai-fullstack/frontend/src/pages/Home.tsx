import { Leaf, HandCoins, Building2, History, CloudSun, MessageSquare, Lightbulb } from 'lucide-react';
import FeatureCard from '@/components/feature-card';
import { useLanguage } from '@/contexts/language-context';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('crop_health_diagnosis_title'),
      description: t('crop_health_diagnosis_desc'),
      href: '/crop-diagnosis',
      icon: <Leaf className="h-7 w-7 text-primary" />,
    },
    {
       title: "Weather Forecast",
       description: "Live weather insights and 5-day forecasts for your location.",
       href: '/weather',
       icon: <CloudSun className="h-7 w-7 text-primary" />,
    },
    {
      title: "Smart Suggestions",
      description: "AI-driven farming advice based on your crops and weather.",
      href: '/suggestions',
      icon: <Lightbulb className="h-7 w-7 text-primary" />,
    },
    {
      title: t('mandi_price_insights_title'),
      description: t('mandi_price_insights_desc'),
      href: '/mandi-prices',
      icon: <HandCoins className="h-7 w-7 text-primary" />,
    },
    {
      title: t('gov_schemes_info_title'),
      description: t('gov_schemes_info_desc'),
      href: '/gov-schemes',
      icon: <Building2 className="h-7 w-7 text-primary" />,
    },
    {
      title: "AI Chat Assistant",
      description: "Ask anything about farming, schemes, or crop health.",
      href: '/chat',
      icon: <MessageSquare className="h-7 w-7 text-primary" />,
    },
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-3xl bg-primary/5 p-8 md:p-12 border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground mb-4">
            {t('welcome_title')}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('welcome_subtitle')} Your all-in-one Agri-Tech companion for smarter farming.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.href}
            {...feature}
          />
        ))}
      </div>
    </div>
  );
}
