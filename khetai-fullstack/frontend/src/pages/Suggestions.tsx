import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getWeather, getSuggestions } from '@/services/api.js';
import { Loader2, Lightbulb, Sprout, Cloud } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function Suggestions() {
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim() && !location.trim()) {
      setError('Please provide either a crop or a location.');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      let weatherCondition = '';
      if (location.trim()) {
        try {
          const weatherData = await getWeather(location);
          if (weatherData && weatherData.condition) {
            weatherCondition = weatherData.condition;
          }
        } catch (wErr) {
          console.warn('Weather fetch failed, proceeding with empty weather', wErr);
        }
      }

      const res = await getSuggestions(crop, weatherCondition);
      if (res.success && res.data.suggestions) {
        setSuggestions(res.data.suggestions);
      } else {
        setError('Failed to fetch suggestions.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error fetching suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Smart Farming Suggestions" subtitle="Get intelligent actionable advice based on weather and your crop." />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle>Request Suggestion</CardTitle>
              <CardDescription>Enter details to get AI-powered farming advice.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFetch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><Sprout className="h-4 w-4 text-green-600" /> Crop Type</label>
                  <Input placeholder="e.g., Rice, Wheat, Cotton..." value={crop} onChange={e => setCrop(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><Cloud className="h-4 w-4 text-blue-500" /> Location (Auto-Weather)</label>
                  <Input placeholder="e.g., Hyderabad" value={location} onChange={e => setLocation(e.target.value)} disabled={loading} />
                </div>
                {error && <div className="text-sm bg-destructive/10 text-destructive p-3 rounded-md">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                  Get Suggestions
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Custom Advice</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-3 bg-muted/40 p-4 rounded-lg border border-border">
                      <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{sug}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center text-muted-foreground p-8">No advice generated yet. Fill out the form to begin.</div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
