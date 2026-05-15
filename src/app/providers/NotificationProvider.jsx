import { createContext, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

const useNotifications = () => useContext(NotificationContext)

let messageCounter = 0

function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([])

  const addMessage = ({ text, type = 'info', duration = 4500 }) => {
    const id = `${Date.now()}-${messageCounter++}`
    const message = { id, text, type }

    setMessages((prev) => [...prev, message])

    if (duration > 0) {
      window.setTimeout(() => {
        setMessages((prev) => prev.filter((item) => item.id !== id))
      }, duration)
    }

    return id
  }

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((item) => item.id !== id))
  }

  const clearMessages = () => {
    setMessages([])
  }

  const value = useMemo(
    () => ({ addMessage, removeMessage, clearMessages, messages }),
    [messages],
  )

  return (
    <NotificationContext.Provider value={value}>
      <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {messages.length > 1 ? (
          <button
            onClick={clearMessages}
            className="self-end rounded-full border border-[#e6ded8] bg-white px-3 py-1 text-[11px] font-semibold text-[#1d1b18] shadow-[0_6px_14px_rgba(61,51,45,0.12)]"
          >
            Cerrar todo
          </button>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start justify-between gap-4 rounded-3xl border px-4 py-3 text-sm shadow-[0_12px_24px_rgba(61,51,45,0.18)] ${
              message.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-[#e6ded8] bg-white text-[#1d1b18]'
            }`}
          >
            <span className="pr-2">{message.text}</span>
            <button
              onClick={() => removeMessage(message.id)}
              className="text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        ))}
      </div>
      {children}
    </NotificationContext.Provider>
  )
}

export { NotificationProvider, useNotifications }
