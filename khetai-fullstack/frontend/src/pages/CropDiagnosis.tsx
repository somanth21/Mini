'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Loader2, Leaf, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/page-header';
import VoiceInputButton from '@/components/voice-input-button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { useHistory } from '@/contexts/history-context';
import { uploadCropImage } from '@/services/api.js';
import { AnswerDisplay } from '@/components/answer-display';

const FormSchema = z.object({
  image: z.any().refine((files) => files?.length > 0, 'Image is required.'),
  query: z.string().min(1, 'Query is required.'),
});

type FormData = z.infer<typeof FormSchema>;

export default function CropDiagnosisPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ diagnosis: string } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { image: undefined, query: '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setDataUri(null);
    setResult(null);
    form.reset();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: FormData) => {
    if (!dataUri) {
      toast({ title: 'No image selected', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await uploadCropImage(data.image[0], data.query, language);
      setResult(response);
      addHistoryItem({ type: 'crop', query: { image: dataUri, query: data.query }, response });
    } catch (error) {
      console.error(error);
      toast({ title: t('diagnosis_error'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('crop_health_diagnosis_title')}</h1>
        <p className="text-muted-foreground mt-2">Upload a photo of your crop to detect diseases and get treatment advice.</p>
      </div>

      <main className="max-w-4xl mx-auto pb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl">{t('upload_crop_photo')}</CardTitle>
                  <CardDescription>{t('upload_image_cta')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <label htmlFor="file-upload" className="w-full cursor-pointer h-full block">
                            <div className={cn(
                                "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all duration-300",
                                preview ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                            )}>
                              {preview ? (
                                <div className="w-full h-full p-2 relative group">
                                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover rounded-xl shadow-inner" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                    <p className="text-white text-sm font-medium">Click to change</p>
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-4 right-4 z-10 shadow-lg" 
                                    onClick={(e) => { e.preventDefault(); clearImage(); }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center p-6">
                                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                                    <Upload className="h-8 w-8 text-primary" />
                                  </div>
                                  <p className="text-sm font-semibold">{t('upload_image_cta')}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP</p>
                                </div>
                              )}
                            </div>
                          </label>
                        </FormControl>
                        <FormMessage />
                        <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loading} />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{t('query_label')}</CardTitle>
                  <CardDescription>Tell us about the symptoms or specific concerns you have.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                              placeholder={t('crop_query_placeholder')} 
                              {...field} 
                              className="min-h-[140px] resize-none text-base p-4 rounded-xl border-muted-foreground/20 focus:ring-primary/20" 
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
                  
                  <div className="pt-4 mt-auto">
                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold rounded-xl shadow-md transition-all hover:shadow-lg">
                      {loading ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-5 w-5 animate-spin" />
                           <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          <span>{t('diagnose_button')}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>

        {(loading || result) && (
          <Card className="mt-8 border-none shadow-2xl bg-card border-t-4 border-t-primary animate-in slide-in-from-top-8 duration-700">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                 <div className="bg-primary/20 p-2 rounded-lg">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                 </div>
                 <CardTitle className="text-xl">
                    {loading ? t('diagnosis_in_progress') : t('diagnosis_result_title')}
                 </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading && (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground animate-pulse">{t('diagnosis_placeholder')}</p>
                </div>
              )}
              {result && (
                <div className="prose prose-emerald dark:prose-invert max-w-none prose-p:leading-relaxed">
                   <AnswerDisplay content={result.diagnosis} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
