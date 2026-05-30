import { useState } from "react"
import { BellRing, Lock, Palette, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SettingsPage = () => {
    const { user } = useAuth()
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [pushAlerts, setPushAlerts] = useState(true)
    const [priceAlerts, setPriceAlerts] = useState(true)
    const [themeMode, setThemeMode] = useState("Aurora Bright")

    const preferences = [
        {
            title: "Notifications",
            description: "Control how Rupse updates you about markets and account activity.",
            icon: BellRing,
        },
        {
            title: "Appearance",
            description: "Keep the interface on the brighter branded theme.",
            icon: Palette,
        },
        {
            title: "Security",
            description: "Manage password and account access settings.",
            icon: Lock,
        },
        {
            title: "Permissions",
            description: "Review the access level assigned to your account.",
            icon: ShieldCheck,
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-primary">Account</p>
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-sm text-muted-foreground">Adjust your dashboard preferences and account defaults.</p>
                </div>

                <Button variant="outline" className="gap-2 self-start sm:self-auto">
                    <SlidersHorizontal className="h-4 w-4" />
                    Save Preferences
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="border-border/70 shadow-sm">
                    <CardHeader className="border-b border-border/60">
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>These settings are tied to the current signed-in user.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <input
                                    type="checkbox"
                                    checked={emailAlerts}
                                    onChange={(event) => setEmailAlerts(event.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-medium">Email alerts</p>
                                    <p className="text-xs text-muted-foreground">Receive summary updates and notable price alerts by email.</p>
                                </div>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <input
                                    type="checkbox"
                                    checked={pushAlerts}
                                    onChange={(event) => setPushAlerts(event.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-medium">In-app notifications</p>
                                    <p className="text-xs text-muted-foreground">Show alerts directly inside the dashboard experience.</p>
                                </div>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <input
                                    type="checkbox"
                                    checked={priceAlerts}
                                    onChange={(event) => setPriceAlerts(event.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-medium">Price movement alerts</p>
                                    <p className="text-xs text-muted-foreground">Get notified when a tracked symbol crosses your threshold.</p>
                                </div>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                <input
                                    type="radio"
                                    name="theme-mode"
                                    checked={themeMode === "Aurora Bright"}
                                    onChange={() => setThemeMode("Aurora Bright")}
                                    className="mt-1 h-4 w-4 border-border text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-medium">Aurora Bright</p>
                                    <p className="text-xs text-muted-foreground">Use the refreshed bright Rupse palette.</p>
                                </div>
                            </label>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-accent/20 p-4">
                            <p className="text-sm font-medium">Current account</p>
                            <p className="text-xs text-muted-foreground">
                                {user?.name || "User"} · {user?.email || "No email available"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {preferences.map((item) => {
                        const Icon = item.icon
                        return (
                            <Card key={item.title} className="border-border/70 shadow-sm">
                                <CardContent className="flex items-start gap-4 pt-6">
                                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                        <CardDescription className="mt-1">{item.description}</CardDescription>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    <Card className="border-border/70 shadow-sm bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle>Need a password update?</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Use the profile menu to change your password securely.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-primary-foreground/90">
                                Security controls are managed from your profile and authentication flow.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage