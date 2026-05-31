import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from "@/lib/auth.schema";
import type { LoginForm } from "@/lib/auth.schema";
import { QUERY_KEYS, TOKEN_KEY, USER_KEY } from '@/constant/constant'
import { ROUTES } from '@/routes/routes'

const LoginPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsPending(true)
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";
      const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await res.json();

      if (!res.ok) {
        setIsPending(false);
        console.error('Login failed', result);
        return;
      }

      // Persist auth data on success so the profile page can hydrate from cache.
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      queryClient.setQueryData([QUERY_KEYS.AUTH], result);
      setIsPending(false);
      navigate(ROUTES.DASHBOARD)
    } catch (e) {
      console.error(e)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Left marketing panel */}
      <div className="hidden lg:flex w-1/2 p-16 flex-col justify-center gap-6 text-white">
        <h2 className="text-4xl font-extrabold">Welcome back</h2>
        <p className="text-lg text-slate-300 max-w-md">
          Sign in to access AI-driven stock predictions, real-time signals, and personalized alerts.
        </p>

        <ul className="space-y-3 mt-6">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <span>AI-powered forecasts with confidence scores</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <span>Alternative data signals (news, mentions, web traffic)</span>
          </li>
        </ul>

        <div className="mt-8">
          <Button size="lg" onClick={() => navigate(ROUTES.HOME)}>
            Back to Landing
          </Button>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/90">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">Sign In</h3>
            <p className="text-sm text-muted-foreground mb-6">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" isLoading={isPending} leftIcon={<LogIn size={16} />}>
                  {isPending ? 'Processing...' : 'Sign In'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate(ROUTES.REGISTER)}>
                  Create account
                </Button>
              </div>
            </form>

            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
