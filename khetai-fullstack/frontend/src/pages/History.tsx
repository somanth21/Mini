'use client';
import { useHistory, HistoryItem } from '@/contexts/history-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Leaf, Building2, HandCoins } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { AnswerDisplay } from '@/components/answer-display';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function History() {
  const { history, loading, clearHistory } = useHistory();
  const [clearing, setClearing] = useState(false);
  const { toast } = useToast();

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await clearHistory();
      toast({
        title: "History Cleared",
        description: "Your query history has been permanently removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'crop': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'scheme': return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'mandi': return <HandCoins className="h-5 w-5 text-orange-600" />;
      default: return <Leaf className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Your Query History</h1>
          <p className="text-muted-foreground mt-2">Review your past diagnostics, prices, and schemes.</p>
        </div>
        
        {history.length > 0 && !loading && (
          <Button 
              variant="destructive" 
              size="sm" 
              disabled={clearing} 
              className="gap-2 rounded-xl shadow-sm h-10 px-4"
              onClick={() => {
                  if (window.confirm("Are you sure you want to clear your entire history? This cannot be undone.")) {
                      handleClearHistory();
                  }
              }}
          >
              <Trash2 className="h-4 w-4" />
              Clear All
          </Button>
        )}
      </div>

      <main className="max-w-4xl mx-auto pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-primary opacity-50" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl opacity-50 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
                <Trash2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No history found</h3>
            <p className="text-muted-foreground max-w-xs mt-2">Start using our AI tools to build your farm history!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item: HistoryItem) => (
              <Card key={item.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-card/50 overflow-hidden">
                <CardHeader className="pb-4 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-background p-2 rounded-lg shadow-sm border">
                        {getIcon(item.type)}
                      </div>
                      <CardTitle className="text-lg font-bold capitalize">{item.type} Query</CardTitle>
                    </div>
                    <CardDescription className="text-xs font-medium px-3 py-1 bg-background rounded-full border">
                      {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Your Inquiry</span>
                    <div className="bg-muted/40 p-4 rounded-xl text-sm leading-relaxed border border-border/50">
                      {typeof item.query === 'object' 
                         ? <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(item.query, null, 2)}</pre>
                         : String(item.query)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Response</span>
                    <div className="bg-card p-4 rounded-xl border-l-4 border-primary shadow-sm prose prose-sm dark:prose-invert max-w-none">
                      <AnswerDisplay content={typeof item.response === 'object' && item.response?.summary ? item.response.summary : (item.response?.diagnosis || String(item.response))} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
