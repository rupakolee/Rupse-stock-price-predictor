import { NavLink } from 'react-router-dom'
import { navConfig } from '../navigation/navConfig'
import { cn } from '@/lib/utils'

const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col transition-all">
            <div className="p-6 text-xl font-bold tracking-tight text-primary">Rupse</div>
            <nav className="flex-1 px-4 space-y-1">
                {navConfig.map((item) => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon size={16} />
                            {item.name}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="border-t border-border" />
        </aside>
    )
}

export default Sidebar
