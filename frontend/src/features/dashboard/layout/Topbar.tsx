import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User, LogOut, Key, Settings, ChevronDown } from 'lucide-react'
import { showConfirm } from '@/lib/sweet-alert/SweetAlert'
import { ROUTES } from '@/routes/routes'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const getUserName = (name?: string) => {
    const trimmed = name?.trim()
    if (trimmed) return trimmed

    if (typeof window !== 'undefined') {
        try {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parsed = JSON.parse(storedUser) as { name?: string }
                const storedName = parsed?.name?.trim()
                if (storedName) return storedName
            }
        } catch {
            // Ignore malformed localStorage payloads and fall back below.
        }
    }

    return 'User'
}

const getUserInitials = (name?: string) => {
    const displayName = getUserName(name)

    if (displayName === 'User') return 'U'

    const parts = displayName.split(/\s+/).filter(Boolean)
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase()
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

const Topbar = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const userName = getUserName(user?.name)
    const userInitials = getUserInitials(user?.name)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        setIsOpen(false)
        const confirmed = await showConfirm({
            title: 'Logout',
            text: "Are you sure you want to log out?",
            icon: 'warning',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        })

        if (confirmed) {
            localStorage.clear()
            window.location.href = ROUTES.LOGIN
        }
    }

    const handleChangePassword = () => {
        setIsOpen(false)
        Swal.fire({
            title: 'Change Password',
            html: `
                <div class="flex flex-col gap-4 text-left p-2">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-muted-foreground uppercase">Current Password</label>
                        <input type="password" id="old-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-muted-foreground uppercase">New Password</label>
                        <input type="password" id="new-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-muted-foreground uppercase">Confirm Password</label>
                        <input type="password" id="confirm-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            confirmButtonColor: 'oklch(0.72 0.19 142)',
            background: 'oklch(0.18 0.02 264)',
            color: 'oklch(0.97 0 0)',
            focusConfirm: false,
            preConfirm: () => {
                const oldPass = (document.getElementById('old-password') as HTMLInputElement).value
                const newPass = (document.getElementById('new-password') as HTMLInputElement).value
                const confirmPass = (document.getElementById('confirm-password') as HTMLInputElement).value

                if (!oldPass || !newPass || !confirmPass) {
                    Swal.showValidationMessage('Please fill in all fields')
                    return false
                }
                if (newPass !== confirmPass) {
                    Swal.showValidationMessage('Passwords do not match')
                    return false
                }
                return { oldPass, newPass }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your password has been updated.',
                    icon: 'success',
                    background: 'oklch(0.18 0.02 264)',
                    color: 'oklch(0.97 0 0)',
                    confirmButtonColor: 'oklch(0.72 0.19 142)',
                })
            }
        })
    }

    return (
        <header className="h-16 bg-card text-foreground border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="font-semibold tracking-tight text-xl">Dashboard</h1>

            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 px-3 py-1.5  transition-all cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                            {userInitials}
                        </div>
                        <div className="flex flex-col items-start text-left hidden sm:flex">
                            <span className="text-sm font-semibold leading-tight">{userName}</span>
                            {/* <span className="text-[10px] text-muted-foreground leading-tight uppercase font-medium">{user?.role || 'Guest'}</span> */}
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-4 border-b border-border bg-accent/20">
                                <p className="text-sm font-semibold">{user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => { setIsOpen(false); navigate(ROUTES.PROFILE); }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-accent rounded-md transition-colors"
                                >   
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Profile Details
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-accent rounded-md transition-colors"
                                >
                                    <Key className="h-4 w-4 text-muted-foreground" />
                                    Change Password
                                </button>
                                <button
                                    onClick={() => { setIsOpen(false); navigate(ROUTES.SETTINGS); }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-accent rounded-md transition-colors"
                                >
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    Settings
                                </button>
                            </div>
                            <div className="p-1 border-t border-border">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;