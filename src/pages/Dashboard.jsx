import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatCard } from '../components/StatCard'
import { useAppContext } from '../context/AppContext'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

export function Dashboard() {
  const { transactions } = useAppContext()

  const { totalBalance, totalIncome, totalExpenses, trendData, categoryData } = useMemo(() => {
    let income = 0
    let expenses = 0
    
    const monthlyMap = {}
    const catMap = {}

    transactions.forEach(t => {
      const amount = Number(t.amount)
      if (t.type === 'income') income += amount
      if (t.type === 'expense') {
        expenses += amount
        if (amount > 0) catMap[t.category] = (catMap[t.category] || 0) + amount
      }

      const date = new Date(t.date)
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { 
          name: monthYear, 
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
          balance: 0, 
          income: 0, 
          expense: 0 
        }
      }
      
      if (t.type === 'income') {
        monthlyMap[monthYear].income += amount
        monthlyMap[monthYear].balance += amount
      } else {
        monthlyMap[monthYear].expense += amount
        monthlyMap[monthYear].balance -= amount
      }
    })

    const chartTrend = Object.values(monthlyMap).sort((a, b) => a.timestamp - b.timestamp)
    
    let runningBalance = 0
    const finalTrendData = chartTrend.map(monthData => {
      runningBalance += monthData.balance
      return { ...monthData, total: runningBalance }
    })

    const finalCategoryData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      trendData: finalTrendData,
      categoryData: finalCategoryData
    }
  }, [transactions])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Your financial health at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Balance" amount={totalBalance} icon={DollarSign} trend={5.2} />
        <StatCard title="Total Income" amount={totalIncome} icon={ArrowUpRight} trend={12.5} />
        <StatCard title="Total Expenses" amount={totalExpenses} icon={ArrowDownRight} trend={-2.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto min-h-[400px]">
        <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Balance Trend</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `$${val.toLocaleString()}`} tickMargin={10} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: 'var(--card)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
          <div className="flex-1 min-h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                No expenses to show
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
