import { useEffect, useMemo, useState } from 'react'

export default function Sales() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [rows, setRows] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [filter, setFilter] = useState({ payment_mode: '', customer_id: '', product_id: '' })
  const [form, setForm] = useState({ items: [], payment_mode: 'Cash', customer_id: '' })

  const load = async () => {
    const r = await fetch(`${baseUrl}/api/sales`)
    setRows(await r.json())
    const p = await fetch(`${baseUrl}/api/products`)
    setProducts(await p.json())
    const c = await fetch(`${baseUrl}/api/customers`)
    setCustomers(await c.json())
  }
  useEffect(() => { load() }, [])

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', quantity: 1, price: 0 }] }))
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))

  const submit = async () => {
    const body = {
      customer_id: form.customer_id || null,
      payment_mode: form.payment_mode,
      items: form.items.filter(i => i.product_id).map(i => ({ product_id: i.product_id, quantity: Number(i.quantity), price: Number(i.price) || undefined }))
    }
    await fetch(`${baseUrl}/api/sales`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setForm({ items: [], payment_mode: 'Cash', customer_id: '' })
    await load()
  }

  const filtered = useMemo(() => rows.filter(r => (
    (!filter.payment_mode || r.payment_mode === filter.payment_mode) &&
    (!filter.customer_id || r.customer_id === filter.customer_id) &&
    (!filter.product_id || (r.items||[]).some(i => i.product_id === filter.product_id))
  )), [rows, filter])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-sm text-gray-500">Record and review sales.</p>
        </div>
        <a href={`${baseUrl}/api/sales/export`} className="px-4 py-2 bg-gray-100 border rounded-lg">Export CSV</a>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <h3 className="font-semibold mb-2">New Sale</h3>
        <div className="grid grid-cols-6 gap-3 items-center mb-2">
          <select value={form.customer_id} onChange={e=>setForm({ ...form, customer_id:e.target.value })} className="px-3 py-2 border rounded-lg col-span-2">
            <option value="">General (walk-in)</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.payment_mode} onChange={e=>setForm({ ...form, payment_mode:e.target.value })} className="px-3 py-2 border rounded-lg">
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Other</option>
          </select>
          <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-lg col-span-2">Add Item</button>
        </div>
        {form.items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-3 mb-2 items-center">
            <select value={it.product_id} onChange={e=>setForm(f=>{ const items=[...f.items]; items[idx]={...items[idx], product_id:e.target.value}; return {...f, items}})} className="px-3 py-2 border rounded-lg col-span-2">
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" value={it.quantity} onChange={e=>setForm(f=>{ const items=[...f.items]; items[idx]={...items[idx], quantity:e.target.value}; return {...f, items}})} className="px-3 py-2 border rounded-lg" placeholder="Qty" />
            <input type="number" value={it.price} onChange={e=>setForm(f=>{ const items=[...f.items]; items[idx]={...items[idx], price:e.target.value}; return {...f, items}})} className="px-3 py-2 border rounded-lg" placeholder="Price (optional)" />
            <button onClick={()=>removeItem(idx)} className="px-3 py-2 border rounded-lg">Remove</button>
          </div>
        ))}
        <div className="text-right">
          <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save Sale</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Items</th>
              <th className="text-left p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3">{r.customer_name || 'General'}</td>
                <td className="p-3">{r.payment_mode}</td>
                <td className="p-3">{(r.items||[]).map(i => `${i.quantity} x ${i.product_name} @ ₹${i.price}`).join(', ')}</td>
                <td className="p-3">₹{Number(r.total_amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
