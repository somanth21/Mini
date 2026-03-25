'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/page-header';
import VoiceInputButton from '@/components/voice-input-button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { useHistory } from '@/contexts/history-context';
import { Loader2, Building2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGovSchemes } from '@/services/api.js';
import { AnswerDisplay } from '@/components/answer-display';

const FormSchema = z.object({
  schemeName: z.string().min(2, 'Scheme name is required.'),
  query: z.string().min(10, 'Query must be at least 10 characters.'),
});

type FormData = z.infer<typeof FormSchema>;

export default function GovSchemesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { schemeName: '', query: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await getGovSchemes(data.schemeName, data.query, language);
      setResult(response);
      addHistoryItem({ type: 'scheme', query: data, response });
    } catch (error) {
      console.error(error);
      toast({ title: t('summary_error'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('gov_schemes_title')}</h1>
        <p className="text-muted-foreground mt-2">Discover government initiatives and financial support for your farming needs.</p>
      </div>

      <main className="max-w-5xl mx-auto pb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl">Search Scheme</CardTitle>
                  <CardDescription>Enter a scheme name or keyword to find details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="schemeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('scheme_name_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('scheme_name_placeholder')} {...field} className="h-11 rounded-xl focus:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('query_label')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                                placeholder={t('query_placeholder')} 
                                {...field} 
                                className="min-h-[120px] resize-none p-4 rounded-xl focus:ring-primary/20" 
                            />
                            <div className="absolute bottom-3 right-3">
                               <VoiceInputButton
                                disabled={loading}
                                onTranscript={(text) => form.setValue('query', text)}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full h-12 text-md font-bold rounded-xl mt-4">
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Building2 className="mr-2 h-5 w-5" />}
                    {t('get_summary_button')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {(loading || result) ? (
                <Card className="border-none shadow-xl bg-card border-t-4 border-t-primary h-full animate-in slide-in-from-right-8 duration-700">
                  <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-xl flex items-center gap-2">
                       <Lightbulb className="h-5 w-5 text-primary" />
                       {loading ? 'Analyzing...' : 'Scheme Summary'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                          <p className="text-lg font-medium text-muted-foreground animate-pulse">{t('summary_placeholder')}</p>
                      </div>
                    ) : (
                      <div className="prose prose-emerald dark:prose-invert max-w-none">
                         <AnswerDisplay content={result?.summary || ''} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl opacity-50">
                    <div className="bg-primary/5 p-6 rounded-full mb-4">
                        <Building2 className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">No results yet</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">Fill the search form to get information about government schemes.</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
