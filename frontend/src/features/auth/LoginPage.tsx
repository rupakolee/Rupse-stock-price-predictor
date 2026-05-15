import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from "@/lib/auth.schema";
import type { LoginForm } from "@/lib/auth.schema";

const LoginPage = () => {
  const navigate = useNavigate()
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
      const res = await fetch("http://localhost:8001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await res.json();
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsPending(false);
      navigate('/dashboard')
      if (!res.ok) {
        setIsPending(false);
        return console.log(result);
      }
    } catch (e) {

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-emerald-500/20 blur-[100px] rounded-full" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-md bg-card/80">
        <CardHeader className="space-y-1 text-center pt-8">
          <CardTitle className="text-2xl font-bold tracking-tight">Access Your Terminal</CardTitle>
          <CardDescription>
            Enter your credentials to manage your stock portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@example.com"
                {...register('email')}
                className={`bg-background/50 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register('password')}
                className={`bg-background/50 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-semibold"
              isLoading={isPending}
              leftIcon={<LogIn size={18} />}
            >
              {isPending ? "Processing..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
