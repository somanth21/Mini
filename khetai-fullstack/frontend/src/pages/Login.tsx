'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { loginCustomer, registerCustomer } from '@/services/api.js';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.length < 4 || password.length < 4) {
      toast({ title: 'Invalid Input', description: 'Enter valid credentials (min 4 chars)', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginCustomer(email, password);
        if (res.success) {
          const payload = JSON.parse(atob(res.data.split('.')[1]));
          login(res.data, email, payload.role);
          toast({ title: 'Welcome Back!' });
          navigate('/');
        }
      } else {
        const res = await registerCustomer(email, password);
        if (res.success) {
          toast({ title: 'Registration Success', description: 'You can now log in.' });
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (err: any) {
      toast({ 
        title: isLogin ? 'Login Failed' : 'Registration Failed', 
        description: err.response?.data?.message || 'An error occurred.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Sign In' : 'Register'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your credentials to access personalized history.' : 'Create an account to save your queries.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Input 
              placeholder="Email or Username" 
              type="text"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading} 
              required 
            />
            <Input 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading} 
              required 
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={() => setIsLogin(!isLogin)} 
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
