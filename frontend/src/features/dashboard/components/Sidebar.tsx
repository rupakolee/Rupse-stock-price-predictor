import { NavLink } from 'react-router-dom'
import { navConfig } from '../config/navConfig'
import { cn } from '@/lib/utils'

const Sidebar = () => {
    const role = "admin" // later use it from the state
    const links = navConfig[role]
    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col transition-all">
            <div className="p-6 text-xl font-bold tracking-tight text-primary">NuroStock</div>
            <nav className='flex-1 px-4 space-y-1'>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                            isActive 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}>
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
