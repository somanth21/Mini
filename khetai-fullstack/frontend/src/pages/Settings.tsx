'use client';
import PageHeader from '@/components/page-header';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and application experience.</p>
      </div>

      <main className="max-w-3xl mx-auto pb-12">
        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <span>Platform Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center">
            <div className="bg-muted/30 p-8 rounded-3xl border-2 border-dashed inline-block mb-4">
                <SettingsIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Future settings will be available here, such as farm profile details, local language preferences, and notification controls.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
