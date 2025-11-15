import { useEffect, useRef, useState } from 'react'

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m BizMate 🤖. Try: “Add sale 2 shirts @ 500 via UPI for Ramesh” or “Add 100 water bottles to stock”.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const r = await fetch(`${baseUrl}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) })
      const data = await r.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Okay ✅' }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error talking to server.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      send()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
          <p className="text-sm text-gray-500">Type instructions in natural language. Use Ctrl+Enter to send.</p>
        </div>
      </div>
      <div ref={listRef} className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-3xl px-4 py-3 rounded-2xl ${m.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-600 text-white ml-auto'}`}>{m.text}</div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Ask BizMate..." className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={send} disabled={loading} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-60">{loading ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  )
}
