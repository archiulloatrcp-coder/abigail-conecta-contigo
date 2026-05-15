import { useMemo } from 'react'

const SAMPLE_EVENTS = {
  '2023-12-01': [
    '9:30a CITA MEDICA - Jorge Codes',
    '11:15a CITA MEDICA - Doctor Cardiol',
    '2:15p CITA MEDICA - Doctor Patol',
  ],
  '2023-12-07': [
    '9:30a CITA MEDICA - Doctor Card',
    '10:30a CITA MEDICA - Doctor Car',
    '2:30p CITA MEDICA - Doctor Patol',
  ],
  '2023-12-12': [
    '9:15a CITA MEDICA - Doctor Codes',
    '11:30a CITA MEDICA - Doctor Card',
  ],
  '2023-12-16': [
    '9:45a CITA MEDICA - Doctor Card',
    '11:30a CITA MEDICA - Jorge Codes',
  ],
  '2023-12-22': [
    '8:45a CITA MEDICA - Doctor Card',
    '9:30a CITA MEDICA - Jorge Codes',
    '3:00p CITA MEDICA - Doctor Patol',
  ],
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const buildCalendarDays = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const weeks = []
  let currentDay = 1 - startOffset

  while (currentDay <= daysInMonth) {
    const week = []
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(year, monthIndex, currentDay)
      const isCurrentMonth = date.getMonth() === monthIndex
      week.push({
        day: date.getDate(),
        isCurrentMonth,
        dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate(),
        ).padStart(2, '0')}`,
      })
      currentDay += 1
    }
    weeks.push(week)
  }

  return weeks
}

function AdminDashboard() {
  const calendarWeeks = useMemo(() => buildCalendarDays(2023, 11), [])

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#6f6a64]">Appointment / Calendar</div>

      <div className="grid gap-4 rounded-3xl border border-[#e6ded8] bg-white p-4 lg:grid-cols-[1.1fr_1.1fr_1.1fr_auto]">
        {['Doctor', 'Paciente', 'Especialidad'].map((label) => (
          <label key={label} className="text-xs font-semibold text-[#1d1b18]">
            {label}
            <select className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm">
              <option>Seleccionar {label.toLowerCase()}</option>
            </select>
          </label>
        ))}
        <div className="flex items-end">
          <button className="w-full rounded-3xl bg-[#b78f8f] px-6 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(61,51,45,0.2)]">
            Buscar
          </button>
        </div>
      </div>

      <section className="hidden rounded-3xl border border-[#e6ded8] bg-white md:block">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6ded8] px-6 py-4">
          <div className="flex items-center gap-2">
            <button className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs">‹</button>
            <button className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs">›</button>
            <button className="rounded-2xl bg-[#f7f5f2] px-3 py-1 text-xs font-semibold text-[#6f6a64]">
              Today
            </button>
          </div>
          <h2 className="text-base font-semibold text-[#1d1b18]">December 2023</h2>
          <div className="flex items-center gap-2">
            {['Month', 'Week', 'Day'].map((item) => (
              <button
                key={item}
                className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                  item === 'Month'
                    ? 'bg-[#b78f8f] text-white'
                    : 'border border-[#e6ded8] text-[#6f6a64]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-[#e6ded8] text-center text-xs font-semibold text-[#6f6a64]">
          {DAYS.map((day) => (
            <div key={day} className="border-r border-[#e6ded8] px-2 py-3 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarWeeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="contents">
              {week.map((day) => (
                <div
                  key={day.dateKey}
                  className="min-h-[140px] border-b border-r border-[#e6ded8] px-2 py-2 last:border-r-0"
                >
                  <div
                    className={`mb-2 text-right text-xs font-semibold ${
                      day.isCurrentMonth ? 'text-[#1d1b18]' : 'text-[#bfb8b2]'
                    }`}
                  >
                    {day.day}
                  </div>
                  <div className="space-y-2 text-[11px]">
                    {(SAMPLE_EVENTS[day.dateKey] || []).map((event) => (
                      <div
                        key={event}
                        className="flex items-start gap-2 rounded-2xl bg-[#f7f5f2] px-2 py-1 text-[#1d1b18]"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#b78f8f]"></span>
                        <span>{event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1d1b18]">Agenda del dia</h2>
          <button className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs">Hoy</button>
        </div>
        <div className="mt-4 space-y-3">
          {(SAMPLE_EVENTS['2023-12-01'] || []).map((event) => (
            <div
              key={event}
              className="flex items-start gap-3 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-3 py-3 text-sm"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-[#b78f8f]"></span>
              <div>
                <p className="text-xs text-[#6f6a64]">Hoy</p>
                <p className="text-sm font-semibold text-[#1d1b18]">{event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
