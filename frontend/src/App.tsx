import { BrowserRouter } from 'react-router-dom'
import Landing from './features/landing/Landing'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div data-theme="market-pro" className="min-h-screen bg-background font-sans">
        <Landing />
      </div>
    </BrowserRouter>
  )
}

export default App
