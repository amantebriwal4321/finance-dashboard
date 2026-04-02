import { TopBar } from './components/TopBar'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Insights } from './pages/Insights'

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <TopBar />
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] snap-y snap-mandatory scroll-smooth">
        <section id="dashboard" className="snap-start min-h-[calc(100vh-64px)] p-6 md:p-10 flex flex-col justify-center">
          <Dashboard />
        </section>
        
        <section id="transactions" className="snap-start min-h-[calc(100vh-64px)] p-6 md:p-10 flex flex-col justify-center bg-muted/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10 pointer-events-none" />
          <Transactions />
        </section>

        <section id="insights" className="snap-start min-h-[calc(100vh-64px)] p-6 md:p-10 flex flex-col justify-center">
          <Insights />
        </section>
      </main>
    </div>
  )
}

export default App
