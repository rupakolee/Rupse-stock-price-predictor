import { useNavigate } from "react-router-dom"
import { Mail, Shield, BadgeCheck, Clock3, Settings2, UserCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/routes/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const getInitials = (name?: string) => {
    const trimmed = name?.trim()
    if (!trimmed) return "U"

    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

const ProfilePage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const initials = getInitials(user?.name)

    const profileItems = [
        { label: "Full Name", value: user?.name || "User" },
        { label: "Email Address", value: user?.email || "Not available" },
        { label: "Role", value: user?.isAdmin ? "Administrator" : "Trader" },
        { label: "Account Type", value: user?.isAdmin ? "Admin account" : "Standard account" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-primary">Profile</p>
                    <h2 className="text-2xl font-bold tracking-tight">Profile Details</h2>
                    <p className="text-sm text-muted-foreground">Review the account information tied to your dashboard session.</p>
                </div>

                <Button onClick={() => navigate(ROUTES.SETTINGS)} className="gap-2 self-start sm:self-auto">
                    <Settings2 className="h-4 w-4" />
                    Account Settings
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <Card className="border-border/70 shadow-sm">
                    <CardHeader className="border-b border-border/60">
                        <CardTitle>Account Summary</CardTitle>
                        <CardDescription>Identity and access details for the currently signed-in user.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                                {initials}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Signed in as</p>
                                    <h3 className="text-2xl font-semibold tracking-tight">{user?.name || "User"}</h3>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs font-medium">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                                        <Shield className="h-3.5 w-3.5" />
                                        {user?.isAdmin ? "Administrator" : "Standard User"}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-accent-foreground">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Active session
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {profileItems.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-border/70 bg-background p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                                    <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="border-b border-border/60">
                            <CardTitle>Session Snapshot</CardTitle>
                            <CardDescription>Quick details about the current dashboard session.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <UserCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">User identity</p>
                                    <p className="text-xs text-muted-foreground">The dashboard is reading the user from the auth cache.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || "Not available"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Clock3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Access level</p>
                                    <p className="text-xs text-muted-foreground">{user?.isAdmin ? "Full dashboard access" : "Standard dashboard access"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-sm bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle>Need to update your profile?</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Use account settings to manage your profile and security preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" onClick={() => navigate(ROUTES.SETTINGS)}>
                                Open Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage