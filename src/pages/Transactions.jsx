import { useState, useMemo } from 'react'
import { Plus, Search, Trash2, Edit2, ArrowUpDown, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { categories } from '../data/mockData'

export function Transactions() {
  const { transactions, role, deleteTransaction, addTransaction, updateTransaction } = useAppContext()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [showForm, setShowForm] = useState(false)
  
  const defaultTx = { amount: '', category: categories[0], type: 'expense', date: new Date().toISOString().split('T')[0] }
  const [editingId, setEditingId] = useState(null)
  const [txForm, setTxForm] = useState(defaultTx)

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions]

    if (filter !== 'all') {
      result = result.filter(t => t.type === filter)
    }

    if (search) {
      const s = search.toLowerCase()
      result = result.filter(t => 
        t.category.toLowerCase().includes(s) || 
        t.amount.toString().includes(s)
      )
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(a.date) - new Date(b.date)
        return sortDir === 'asc' ? diff : -diff
      } else {
        const diff = a.amount - b.amount
        return sortDir === 'asc' ? diff : -diff
      }
    })

    return result
  }, [transactions, filter, search, sortField, sortDir])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const handleEditClick = (t) => {
    setTxForm({ category: t.category, type: t.type, amount: t.amount, date: t.date })
    setEditingId(t.id)
    setShowForm(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!txForm.amount || isNaN(txForm.amount)) return
    
    if (editingId) {
      updateTransaction(editingId, { ...txForm, amount: Number(txForm.amount) })
    } else {
      addTransaction({ ...txForm, amount: Number(txForm.amount) })
    }
    
    setShowForm(false)
    setEditingId(null)
    setTxForm(defaultTx)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground mt-1">Manage and view your financial history.</p>
        </div>
        {role === 'Admin' && (
          <button 
            onClick={() => {
              setEditingId(null)
              setTxForm(defaultTx)
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
        )}
      </div>

      {showForm && role === 'Admin' && (
        <form onSubmit={handleFormSubmit} className="bg-card/80 backdrop-blur-sm text-card-foreground p-6 rounded-2xl border border-border shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <select 
                value={txForm.type} 
                onChange={e => setTxForm({...txForm, type: e.target.value})}
                className="w-full p-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <input 
                type="number" 
                value={txForm.amount} 
                onChange={e => setTxForm({...txForm, amount: e.target.value})}
                className="w-full p-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <select 
                value={txForm.category} 
                onChange={e => setTxForm({...txForm, category: e.target.value})}
                className="w-full p-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <input 
                type="date" 
                value={txForm.date} 
                onChange={e => setTxForm({...txForm, date: e.target.value})}
                className="w-full p-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm">
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center bg-muted/30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search by amount or category..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 mb-0 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
            />
          </div>
          <div className="flex bg-muted/60 p-1.5 rounded-xl w-full sm:w-auto">
            {['all', 'income', 'expense'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {filteredAndSorted.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-muted/95 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">Date <ArrowUpDown size={14} className={sortField === 'date' ? 'text-primary' : ''} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Category</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Type</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">Amount <ArrowUpDown size={14} className={sortField === 'amount' ? 'text-primary' : ''} /></div>
                  </th>
                  {role === 'Admin' && <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40 even:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{t.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    {role === 'Admin' && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleEditClick(t)}
                          className="p-2 mr-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="opacity-50" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">No transactions found</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
