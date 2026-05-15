import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, TrendingUp, CheckCircle2 } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating a registration delay
    setTimeout(() => {
      setIsLoading(false)
      navigate('/login')
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
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
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="*******"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="*******"
                className="bg-background/50"
              />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <div className="mt-1 h-4 w-4 rounded-sm border border-border flex items-center justify-center text-primary">
                <CheckCircle2 size={12} className="opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                By creating an account, you agree to our{' '}
                <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full font-semibold mt-4"
              isLoading={isLoading}
              leftIcon={<UserPlus size={18} />}
            >
              {isLoading ? "Creating Account..." : "Get Started"}
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
