import { useEffect, useState } from 'react'

export default function SettingsView() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [pinSet, setPinSet] = useState(false)
  const [pin, setPin] = useState('')
  const [theme, setTheme] = useState('system')
  const [lang, setLang] = useState('en')
  const [note, setNote] = useState('')

  const load = async () => {
    const r = await fetch(`${baseUrl}/api/settings`)
    const data = await r.json()
    const byKey = Object.fromEntries(data.map(d => [d.key, d.value]))
    setPinSet(Boolean(byKey.pin_hash))
    setTheme(byKey.theme || 'system')
    setLang(byKey.lang || 'en')
    setNote('')
  }
  useEffect(() => { load() }, [])

  const savePref = async (key, value) => {
    await fetch(`${baseUrl}/api/settings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
    await load()
  }

  const setupPin = async () => {
    const r = await fetch(`${baseUrl}/api/auth/setup-pin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) })
    if (r.ok) { setNote('PIN set!'); setPin(''); setPinSet(true) } else { setNote('PIN already set or invalid.') }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500">Customize your preferences.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="font-semibold mb-2">Security</div>
          <div className="space-y-2">
            <div className="text-sm">PIN status: {pinSet ? 'Configured' : 'Not set'}</div>
            {!pinSet && (
              <div className="flex gap-2">
                <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Set PIN" className="px-3 py-2 border rounded-lg" />
                <button onClick={setupPin} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save PIN</button>
              </div>
            )}
            {note && <div className="text-xs text-gray-500">{note}</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="font-semibold mb-2">Preferences</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="col-span-1">Theme
              <select value={theme} onChange={e=>{ setTheme(e.target.value); savePref('theme', e.target.value) }} className="block w-full mt-1 px-3 py-2 border rounded-lg">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </label>
            <label className="col-span-1">Language
              <select value={lang} onChange={e=>{ setLang(e.target.value); savePref('lang', e.target.value) }} className="block w-full mt-1 px-3 py-2 border rounded-lg">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="font-semibold mb-2">Backup</div>
        <div className="flex gap-2 text-sm">
          <a href={`${baseUrl}/api/backup/export`} className="px-4 py-2 border rounded-lg">Export JSON</a>
        </div>
      </div>
    </div>
  )
}
