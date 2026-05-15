import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <div data-theme="finance" className="min-h-screen bg-background font-sans text-foreground">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
