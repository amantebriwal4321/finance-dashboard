import { Moon, Sun, Wallet } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export function TopBar() {
  const { theme, toggleTheme, role, setRole } = useAppContext()

  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-border bg-card/80 backdrop-blur-md text-card-foreground shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Wallet size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">FinDash</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${role === 'Viewer' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('Viewer')}
          >
            Viewer
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${role === 'Admin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('Admin')}
          >
            Admin
          </button>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}
