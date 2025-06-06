import React, { useState } from 'react';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { useAuthStore } from '../../store/authStore';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }
      
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail size={18} />}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock size={18} />}
          />
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            leftIcon={mode === 'signin' ? <LogIn size={18} /> : <User size={18} />}
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-slate-600">
            {mode === 'signin' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <a 
              href={mode === 'signin' ? '/signup' : '/signin'} 
              className="text-emerald-600 hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};