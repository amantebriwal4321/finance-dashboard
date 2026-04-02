import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { AlertCircle, TrendingDown, Target, Zap } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { AnimatedNumber } from '../components/AnimatedNumber'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

export function Insights() {
  const { transactions } = useAppContext()

  const { highestCategory, pieData, monthlyComparison, savingsRate, avgExpense } = useMemo(() => {
    let income = 0
    let expenses = 0
    let txCount = 0
    const catMap = {}
    const monthMap = {}

    transactions.forEach(t => {
      const amount = Number(t.amount)
      const date = new Date(t.date)
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      
      if (!monthMap[month]) monthMap[month] = 0

      if (t.type === 'income') {
        income += amount
      } else {
        expenses += amount
        txCount++
        catMap[t.category] = (catMap[t.category] || 0) + amount
        monthMap[month] += amount
      }
    })

    const pieData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const highestCategory = pieData.length > 0 ? pieData[0] : null

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    const avgExpense = txCount > 0 ? expenses / txCount : 0

    const sortedMonths = Object.entries(monthMap).sort((a, b) => new Date(b[0]) - new Date(a[0]))
    let monthlyComparison = null
    if (sortedMonths.length >= 2) {
      const current = sortedMonths[0][1]
      const previous = sortedMonths[1][1]
      const diff = current - previous
      const pct = previous > 0 ? (diff / previous) * 100 : 0
      monthlyComparison = { current, previous, diff, pct }
    } else if (sortedMonths.length === 1) {
      monthlyComparison = { current: sortedMonths[0][1], previous: 0, diff: sortedMonths[0][1], pct: 100 }
    }

    return { highestCategory, pieData, monthlyComparison, savingsRate, avgExpense }
  }, [transactions])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Insights</h2>
        <p className="text-muted-foreground mt-1">Deep dive into your spending habits and patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="p-3 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Highest Spending</h3>
            <p className="text-2xl font-bold mt-1">
              {highestCategory ? highestCategory.name : 'N/A'}
            </p>
            {highestCategory && (
              <p className="text-sm text-muted-foreground mt-1">
                $<AnimatedNumber value={highestCategory.value} /> total
              </p>
            )}
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Monthly Comparison</h3>
            <p className="text-2xl font-bold mt-1">
              {monthlyComparison && monthlyComparison.pct < 0 ? '-' : '+'}
              <AnimatedNumber value={Math.abs(monthlyComparison?.pct || 0)} />%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              vs previous active month
            </p>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="p-3 bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-xl">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Savings Rate</h3>
            <p className="text-2xl font-bold mt-1">
              <AnimatedNumber value={savingsRate} />%
            </p>
            <p className="text-sm mt-1 text-muted-foreground flex items-center gap-1">
              <Zap size={14} className="text-yellow-500" /> Avg exp: $<AnimatedNumber value={avgExpense} />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-6">Expense Distribution</h3>
        <div className="flex-1 min-h-0">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Not enough data for insights
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
