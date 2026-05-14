import { useEffect, useState } from 'react'
import { Search, UserCheck, UserX, Trash2, RefreshCw } from 'lucide-react'
import { adminApi } from '../../api/admin'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  const load = () => {
    setLoading(true)
    adminApi.getUsers({ search }).then(({ data }) => {
      setUsers(data.results ?? data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  const toggle = async (user) => {
    setActionId(user.id)
    try {
      const { data } = await adminApi.updateUser(user.id, { is_active: !user.is_active })
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: data.is_active } : u))
    } finally {
      setActionId(null)
    }
  }

  const remove = async (user) => {
    if (!confirm(`Permanently delete ${user.email}?`)) return
    setActionId(user.id)
    try {
      await adminApi.deleteUser(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">{users.length} users</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input className="input pl-11" placeholder="Search by name or email…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={Search} title="No users found" description="Try a different search." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-4 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-700/40 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-brand-300">
                            {u.first_name?.[0] || u.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-200 font-medium">
                          {u.first_name} {u.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={u.is_staff ? 'badge-red' : 'badge-blue'}>
                        {u.is_staff ? 'Admin' : u.role?.name || 'User'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={u.is_active ? 'badge-green' : 'badge-red'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">{formatDate(u.date_joined || u.created_at)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggle(u)}
                          disabled={actionId === u.id}
                          title={u.is_active ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.is_active
                              ? 'text-yellow-400 hover:bg-yellow-500/10'
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          } disabled:opacity-40`}
                        >
                          {actionId === u.id ? <Spinner size="sm" /> : u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => remove(u)}
                          disabled={actionId === u.id || u.is_staff}
                          title="Delete user"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' })
}
