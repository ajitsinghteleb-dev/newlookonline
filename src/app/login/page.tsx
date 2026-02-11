'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from 'lucide-react'
import { useFirebaseAuthInstance } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const auth = useFirebaseAuthInstance();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // If user is already logged in, redirect them from login page
        if (user) {
            const redirectUrl = searchParams.get('redirect') || '/admin';
            router.push(redirectUrl);
        }
    }, [user, router, searchParams]);

    const handleLogin = async () => {
        if (!email || !password) {
            toast({ variant: "destructive", title: "Error", description: "Please enter email and password." });
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Login Successful!" });
            const redirectUrl = searchParams.get('redirect') || '/admin';
            router.push(redirectUrl);
        } catch (e: any) {
            toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials. Please try again." });
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast({ title: "Login Successful!" });
            const redirectUrl = searchParams.get('redirect') || '/admin';
            router.push(redirectUrl);
        } catch (e: any) {
            toast({ variant: "destructive", title: "Google Login Failed", description: e.message });
        }
    };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Lock className="w-10 h-10 text-primary"/>
            </div>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ajitsingh0110@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} type="submit" className="w-full">
              Login
            </Button>
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
