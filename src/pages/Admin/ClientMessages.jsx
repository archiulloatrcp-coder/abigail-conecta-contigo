import { useEffect, useMemo, useState } from 'react'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import {
  listenClientMessages,
  markClientMessageAsRead,
  removeClientMessage,
} from '../../services/clientMessages.js'

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'Pendiente'

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp.toDate())
}

const formatDateInput = (timestamp) => {
  if (!timestamp?.toDate) return ''

  return timestamp.toDate().toISOString().slice(0, 10)
}

const getExcerpt = (message) => {
  if (!message) return '—'
  return message.length > 100 ? `${message.slice(0, 100)}...` : message
}

function ClientMessages() {
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenClientMessages(setMessages)
    return () => unsubscribe()
  }, [])

  const summary = useMemo(() => {
    const unread = messages.filter((item) => !item.isRead).length
    return {
      total: messages.length,
      unread,
      read: messages.length - unread,
    }
  }, [messages])

  const visibleMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return messages.filter((item) => {
      const matchesSearch = normalizedSearch
        ? [item.fullName, item.email, item.phone, item.message]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)
        : true

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'unread'
            ? !item.isRead
            : item.isRead

      const messageDate = formatDateInput(item.createdAt)
      const matchesFrom = fromDate ? messageDate >= fromDate : true
      const matchesTo = toDate ? messageDate <= toDate : true

      return matchesSearch && matchesStatus && matchesFrom && matchesTo
    })
  }, [fromDate, messages, search, statusFilter, toDate])

  const openDetail = async (message) => {
    setSelectedMessage(message)

    if (!message.isRead) {
      try {
        await markClientMessageAsRead(message.id, true)
      } catch (error) {
        console.error('Read message error', error)
        addMessage({ type: 'error', text: 'No pudimos marcar el mensaje como leído.' })
      }
    }
  }

  const handleToggleRead = async (message) => {
    try {
      await markClientMessageAsRead(message.id, !message.isRead)
      if (selectedMessage?.id === message.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: !message.isRead } : prev))
      }
      addMessage({
        type: 'success',
        text: !message.isRead ? 'Mensaje marcado como leído.' : 'Mensaje marcado como no leído.',
      })
    } catch (error) {
      console.error('Toggle read error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar el mensaje.' })
    }
  }

  const handleDelete = async (message) => {
    if (!window.confirm(`¿Eliminar el mensaje de ${message.fullName}?`)) {
      return
    }

    try {
      await removeClientMessage(message.id)
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null)
      }
      addMessage({ type: 'success', text: 'Mensaje eliminado.' })
    } catch (error) {
      console.error('Delete message error', error)
      addMessage({ type: 'error', text: 'No pudimos eliminar el mensaje.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#6f6a64]">Mensajes / Bandeja</div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total', value: summary.total },
          { label: 'No leídos', value: summary.unread },
          { label: 'Leídos', value: summary.read },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-[#e6ded8] bg-white p-4 shadow-[0_12px_24px_rgba(61,51,45,0.12)]"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#1d1b18]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Mensajes de Clientes</h2>
            <p className="text-xs text-[#6f6a64]">Consulta y da seguimiento a solicitudes del landing.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-3 py-2 text-xs text-[#6f6a64]">
              <span>🔍</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o contacto"
                className="w-52 bg-transparent text-xs text-[#1d1b18] outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-xs text-[#1d1b18]"
            >
              <option value="all">Todos</option>
              <option value="unread">No leídos</option>
              <option value="read">Leídos</option>
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-xs text-[#1d1b18]"
            />
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-xs text-[#1d1b18]"
            />
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Contacto</th>
                <th className="pb-3">Mensaje</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleMessages.map((message) => (
                <tr key={message.id} className="border-t border-[#e6ded8]">
                  <td className="py-3 font-semibold text-[#1d1b18]">{message.fullName}</td>
                  <td className="py-3 text-[#6f6a64]">{message.contactSummary || message.email || message.phone || '—'}</td>
                  <td className="py-3 text-[#6f6a64]">{getExcerpt(message.message)}</td>
                  <td className="py-3 text-[#6f6a64]">{formatDate(message.createdAt)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                        message.isRead ? 'bg-[#e7f4ef] text-[#3b6f5a]' : 'bg-[#f7efe7] text-[#8a6d57]'
                      }`}
                    >
                      {message.isRead ? 'Leído' : 'No leído'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(message)}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleRead(message)}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#6f6a64]"
                      >
                        {message.isRead ? 'No leído' : 'Marcar leído'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(message)}
                        className="rounded-2xl border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_18px_36px_rgba(61,51,45,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#1d1b18]">Detalle del mensaje</h3>
                <p className="text-xs text-[#6f6a64]">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-2xl border border-[#e6ded8] px-2 py-1 text-xs"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#b78f8f]">Nombre</p>
                <p className="mt-2 text-sm font-semibold text-[#1d1b18]">{selectedMessage.fullName}</p>
              </div>
              <div className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#b78f8f]">Contacto</p>
                <p className="mt-2 text-sm text-[#1d1b18]">{selectedMessage.contactSummary || '—'}</p>
              </div>
              <div className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#b78f8f]">Correo</p>
                <p className="mt-2 text-sm text-[#1d1b18]">{selectedMessage.email || '—'}</p>
              </div>
              <div className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#b78f8f]">Celular</p>
                <p className="mt-2 text-sm text-[#1d1b18]">{selectedMessage.phone || '—'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#b78f8f]">Mensaje</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#1d1b18]">{selectedMessage.message}</p>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage)}
                className="rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]"
              >
                {selectedMessage.isRead ? 'Marcar no leído' : 'Marcar leído'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage)}
                className="rounded-3xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ClientMessages
