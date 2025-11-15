import { useEffect, useState } from 'react'

export default function Products() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ name: '', unit_price: 0, quantity: 0, threshold: 0 })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const r = await fetch(`${baseUrl}/api/products`)
    const d = await r.json()
    setRows(d)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    setLoading(true)
    await fetch(`${baseUrl}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, unit_price: Number(form.unit_price), quantity: Number(form.quantity), threshold: Number(form.threshold) }) })
    setForm({ name: '', unit_price: 0, quantity: 0, threshold: 0 })
    await load()
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">Stock</h1>
          <p className="text-sm text-gray-500">Manage your products and quantities.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <h3 className="font-semibold mb-2">Add / Update Stock</h3>
        <div className="grid grid-cols-5 gap-3">
          <input value={form.name} onChange={e=>setForm({ ...form, name:e.target.value })} placeholder="Product name" className="px-3 py-2 border rounded-lg" />
          <input type="number" value={form.unit_price} onChange={e=>setForm({ ...form, unit_price:e.target.value })} placeholder="Unit price" className="px-3 py-2 border rounded-lg" />
          <input type="number" value={form.quantity} onChange={e=>setForm({ ...form, quantity:e.target.value })} placeholder="Quantity" className="px-3 py-2 border rounded-lg" />
          <input type="number" value={form.threshold} onChange={e=>setForm({ ...form, threshold:e.target.value })} placeholder="Threshold" className="px-3 py-2 border rounded-lg" />
          <button onClick={add} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading?'Saving...':'Save'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Qty</th>
              <th className="text-left p-3">Unit Price</th>
              <th className="text-left p-3">Threshold</th>
              <th className="text-left p-3">Low?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">₹{Number(r.unit_price).toFixed(2)}</td>
                <td className="p-3">{r.threshold}</td>
                <td className="p-3">{r.low_stock ? '⚠️' : '✅'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
