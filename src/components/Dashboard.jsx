import { useEffect, useMemo, useState } from 'react'

export default function Dashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [data, setData] = useState(null)

  const load = async () => {
    const r = await fetch(`${baseUrl}/api/stats/summary`)
    setData(await r.json())
  }
  useEffect(() => { load() }, [])

  if (!data) return <div>Loading...</div>

  const pmTotal = (mode) => data.payment_modes.find(m => m.mode === mode)?.amount || 0

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard & Analytics</h1>
        <p className="text-sm text-gray-500">At-a-glance performance and insights.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-sm text-gray-500">Daily Sales</div>
          <div className="text-3xl font-bold">₹{Number(data.daily).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-sm text-gray-500">Monthly Sales</div>
          <div className="text-3xl font-bold">₹{Number(data.monthly).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-sm text-gray-500">Yearly Sales</div>
          <div className="text-3xl font-bold">₹{Number(data.yearly).toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border">
          <div className="font-semibold mb-2">Top Products</div>
          <ul className="space-y-1">
            {data.top_products.map((p, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span>{p.quantity} pcs</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="font-semibold mb-2">Top Customers</div>
          <ul className="space-y-1">
            {data.top_customers.map((c, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{c.name}</span>
                <span>₹{Number(c.amount).toFixed(0)} • {c.orders} orders</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border">
          <div className="font-semibold mb-2">Payment Modes</div>
          <ul className="text-sm space-y-1">
            <li>UPI: ₹{Number(pmTotal('UPI')).toFixed(2)}</li>
            <li>Cash: ₹{Number(pmTotal('Cash')).toFixed(2)}</li>
            <li>Card: ₹{Number(pmTotal('Card')).toFixed(2)}</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-4 border col-span-2">
          <div className="font-semibold mb-2">Low Stock Alerts</div>
          <ul className="text-sm space-y-1">
            {data.low_stock.length === 0 ? (
              <li>All good ✅</li>
            ) : data.low_stock.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span>{p.name}</span>
                <span>Qty: {p.quantity} / Threshold: {p.threshold}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
