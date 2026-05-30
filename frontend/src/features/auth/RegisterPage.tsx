import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/auth.schema'
import type { RegisterForm } from '@/lib/auth.schema'
import { ROUTES } from '@/routes/routes'

const Register = () => {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsPending(true)
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";
      const res = await fetch(`${base}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        setIsPending(false);
        return console.log(result);
      }
      setIsPending(false);
      navigate('/login')
    } catch (e) {
      console.error(e)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Left: form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/90">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">Create your account</h3>
            <p className="text-sm text-muted-foreground mb-6">Start using predictions and signals in minutes</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Your name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

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

              <div>
                <Label htmlFor="confirmPassword">Confirm</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" isLoading={isPending} leftIcon={<UserPlus size={16} />}>
                  {isPending ? 'Creating...' : 'Get Started'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                  Already have an account? Sign in
                </Button>
              </div>
            </form>

            
          </CardContent>
          <CardFooter className="pb-6">
            <div className="text-center">
              <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)}>Back to Landing</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right: marketing */}
      <div className="hidden lg:flex w-1/2 p-16 flex-col justify-center gap-6 text-white">
        <h2 className="text-4xl font-extrabold">Join the community</h2>
        <p className="text-lg text-slate-300 max-w-md">
          Get AI forecasts, sentiment signals, and customizable alerts — all in one dashboard.
        </p>

        <ul className="space-y-3 mt-6">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <span>Fast, explainable predictions</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <span>Integrations with market data and news</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Register
