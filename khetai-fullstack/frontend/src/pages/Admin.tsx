'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAdminQueries, fetchAllUsers } from '@/services/api.js';
import { Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/page-header';

export default function Admin() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [queries, setQueries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    } else {
      loadQueries();
    }
  }, [isAdmin, isAuthenticated, navigate]);

  const loadQueries = async () => {
    try {
      const [data, usersData] = await Promise.all([fetchAdminQueries(), fetchAllUsers()]);
      setQueries(data);
      setUsers(usersData);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Oversee platform activity and monitor user interactions.</p>
      </div>

      <main className="space-y-8 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-80">Total Queries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{loading ? '...' : queries.length}</div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{loading ? '...' : users.length}</div>
                </CardContent>
            </Card>
        </div>

        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-xl">Platform Activity</CardTitle>
                    <CardDescription>Real-time log of farmer queries across the system.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-primary opacity-50" />
                <p className="text-muted-foreground animate-pulse">Fetching records...</p>
              </div>
            ) : queries.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No queries recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-widest border-b">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Query Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {queries.map((q) => (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                            {new Date(q.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-6 py-4 font-medium">{q.user?.email || 'Guest User'}</td>
                        <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">
                                {q.type}
                            </span>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                            <div className="truncate text-muted-foreground" title={q.queryData}>
                                {q.queryData}
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Registered Farmers</CardTitle>
                <CardDescription>Management and overview of platform users.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
               <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary opacity-50" /></div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-widest border-b">
                    <tr>
                      <th className="px-6 py-4">Farmer Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold">{u.email}</td>
                        <td className="px-6 py-4">
                            <span className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                                u.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground'
                            )}>
                                {u.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
