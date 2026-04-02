import { AnimatedNumber } from './AnimatedNumber'

export function StatCard({ title, amount, icon: Icon, trend }) {
  const isPositive = trend >= 0
  
  return (
    <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1.5 duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          $<AnimatedNumber value={amount} />
        </h2>
      </div>
      {trend !== undefined && (
        <div className="mt-2 text-sm flex items-center gap-1">
          <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  )
}
