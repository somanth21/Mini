import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getWeather } from '@/services/api.js';
import { Loader2, Search, CloudSun, CloudRain, Cloud, Sun, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function Weather() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const data = await getWeather(location);
      if (data) {
        setWeatherData(data);
      } else {
        setError('No data returned.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="h-16 w-16 text-blue-500" />;
    if (lower.includes('cloud') || lower.includes('overcast') || lower.includes('fog')) return <Cloud className="h-16 w-16 text-gray-500" />;
    if (lower.includes('sun') || lower.includes('clear')) return <Sun className="h-16 w-16 text-yellow-500" />;
    return <CloudSun className="h-16 w-16 text-orange-400" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Weather Forecast</h1>
        <p className="text-muted-foreground mt-2">Check the precise weather conditions for any city.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-none shadow-lg overflow-hidden bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
             <CardTitle className="text-xl">Search Location</CardTitle>
             <CardDescription>Enter a city name to discover real-time climate data.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Hyderabad, Punjab..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="pl-10 h-11 transition-all focus:ring-primary/20"
                required
              />
              <Button type="submit" disabled={loading} className="px-6 h-11 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm border border-destructive/20 flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <ShieldAlert className="h-4 w-4" />
                {error}
            </div>
        )}

        {weatherData && (
          <Card className="border-none shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-br from-primary via-emerald-600 to-blue-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md mb-6 shadow-xl border border-white/20">
                        {renderIcon(weatherData.condition)}
                    </div>
                    
                    <div className="text-center space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight">{weatherData.location}</h3>
                        <div className="text-6xl font-black">{weatherData.temperature}</div>
                        <div className="text-xl font-medium opacity-90 capitalize">{weatherData.condition}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-8 max-w-sm">
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-center">
                            <span className="text-xs uppercase font-bold opacity-70 tracking-widest mb-1 text-white">Humidity</span>
                            <span className="text-xl font-bold">{weatherData.humidity}</span>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-center">
                            <span className="text-xs uppercase font-bold opacity-70 tracking-widest mb-1 text-white">Precise</span>
                            <span className="text-xl font-bold">{weatherData.condition}</span>
                        </div>
                    </div>
                </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
