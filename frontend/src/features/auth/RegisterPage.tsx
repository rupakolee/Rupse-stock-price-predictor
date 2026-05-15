import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/auth.schema'
import type { RegisterForm } from '@/lib/auth.schema'

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
      const res = await fetch("http://localhost:8001/api/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[25%] h-[25%] bg-indigo-500/20 blur-[100px] rounded-full" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-md bg-card/80">
        <CardHeader className="space-y-1 text-center pt-8">
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription>
            Join thousands of traders using our AI prediction tools
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register('name')}
                className={`bg-background/50 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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
                placeholder="*******"
                {...register('password')}
                className={`bg-background/50 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="*******"
                {...register('confirmPassword')}
                className={`bg-background/50 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            {/* <div className="flex items-start space-x-2 pt-2">
              <div className="mt-1 h-4 w-4 rounded-sm border border-border flex items-center justify-center text-primary">
                <CheckCircle2 size={12} className="opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                By creating an account, you agree to our{' '}
                <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </div> */}
            <Button
              type="submit"
              className="w-full font-semibold mt-4"
              isLoading={isPending}
              leftIcon={<UserPlus size={18} />}
            >
              {isPending ? "Creating Account..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
