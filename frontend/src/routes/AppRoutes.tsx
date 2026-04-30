import { Route, Routes } from 'react-router-dom'
import { Landing } from '@/features/landing'
import { LoginPage, RegisterPage } from '@/features/auth'
import { DashboardLayout, DashboardHome } from '@/features/dashboard'
import { ProtectedRoute } from '.'
import PublicRoute from './PublicRoute'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import PageNotFound from '@/pages/PageNotFound'
import ServerError from '@/pages/ServerError'
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route path='/server-error' element={<ServerError />} />

            {/* Guest Only Routes */}
            <Route element={<PublicRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
            </Route>

            {/* Private Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path='/dashboard' element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    {/* <Route path='analytics' element={<Analytics />} /> */}
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                {/* for future admin only route */}
            </Route>

            {/* 4. Catch-all for 404 */}
            <Route path="*" element={<PageNotFound />} />

        </Routes>
    )
}

export default AppRoutes