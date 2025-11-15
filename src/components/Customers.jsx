import { useEffect, useState } from 'react'

export default function Customers() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const url = q ? `${baseUrl}/api/customers?q=${encodeURIComponent(q)}` : `${baseUrl}/api/customers`
    const r = await fetch(url)
    const d = await r.json()
    setRows(d)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    setLoading(true)
    await fetch(`${baseUrl}/api/customers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setShowAdd(false)
    setForm({ name: '', phone: '', email: '' })
    await load()
    setLoading(false)
  }

  const del = async (id) => {
    if (!confirm('Delete this customer?')) return
    await fetch(`${baseUrl}/api/customers/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">Manage your customer list.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Customer</button>
      </div>

      <div className="flex gap-3 mb-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name/phone/email" className="px-3 py-2 border rounded-lg flex-1" />
        <button onClick={load} className="px-3 py-2 border rounded-lg">Search</button>
      </div>

      <div className="bg-white rounded-xl border p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Debt</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.phone || '-'}</td>
                <td className="p-3">{r.email || '-'}</td>
                <td className="p-3">₹{(r.debt_balance||0).toFixed(2)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => del(r.id)} className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[480px]">
            <h3 className="text-lg font-semibold mb-4">Add Customer</h3>
            <div className="grid gap-3">
              <input value={form.name} onChange={e=>setForm({ ...form, name:e.target.value })} placeholder="Name" className="px-3 py-2 border rounded-lg" />
              <input value={form.phone} onChange={e=>setForm({ ...form, phone:e.target.value })} placeholder="Phone" className="px-3 py-2 border rounded-lg" />
              <input value={form.email} onChange={e=>setForm({ ...form, email:e.target.value })} placeholder="Email" className="px-3 py-2 border rounded-lg" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowAdd(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={add} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
