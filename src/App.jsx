const heroVideoImg =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200'
const profileImg =
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=900'
const methodImg =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900'

function App() {
  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3f3a36]">
      <header className="sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <nav className="flex items-center justify-between gap-4 rounded-full border border-[#e6ded8] bg-white/90 px-5 py-3 shadow-[0_10px_20px_rgba(61,51,45,0.08)] backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1d1b18]">
              <span className="h-7 w-7 rounded-[10px_4px_10px_4px] bg-gradient-to-br from-[#c8a5a5] to-[#e7d1c9]"></span>
              Abigail Conecta Contigo
            </div>
            <div className="hidden items-center gap-4 text-[12px] text-[#6f6a64] md:flex">
              <a href="#perfil">Perfil</a>
              <a href="#porque">Por que</a>
              <a href="#ayuda">Ayuda</a>
              <a href="#metodo">Metodo</a>
              <a href="#pilares">Pilares</a>
              <a href="#funciona">Como funciona</a>
              <a href="#testimonios">Testimonios</a>
              <a href="#agenda">Agenda</a>
            </div>
            <button className="rounded-full border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]">
              Agenda gratuita
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-24 pt-6">
        <section className="grid items-center gap-10 rounded-[22px] bg-gradient-to-br from-[#c8a5a5] to-[#b78f8f] px-10 py-14 text-white shadow-[0_18px_36px_rgba(61,51,45,0.12)] md:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
              Psicologia positiva con enfoque humano
            </p>
            <h1 className="font-heading text-4xl leading-tight text-white md:text-[40px]">
              Construye la felicidad y alcanza la plenitud en poco tiempo
            </h1>
            <p className="text-sm text-white/85 md:text-[15px]">
              Gestiona tus emociones con acompanamiento profesional y un metodo
              probado. Agenda tu primera sesion gratuita y recibe tu plan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#1d1b18] shadow-[0_10px_20px_rgba(61,51,45,0.1)]">
                Solicitar consulta gratuita
              </button>
              <button className="rounded-full border border-white/60 px-5 py-2 text-xs font-semibold text-white">
                Ver video
              </button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm rounded-[18px] bg-white/20 p-3 shadow-[0_20px_38px_rgba(61,51,45,0.2)]">
            <img
              src={heroVideoImg}
              alt="Psicologa en una sesion"
              className="h-48 w-full rounded-[14px] object-cover md:h-56"
            />
            <button
              className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#b78f8f] shadow-[0_10px_20px_rgba(61,51,45,0.15)]"
              aria-label="Reproducir video"
            >
              <span className="ml-1 block h-0 w-0 border-b-[9px] border-t-[9px] border-b-transparent border-t-transparent border-l-[14px] border-l-[#b78f8f]"></span>
            </button>
          </div>
        </section>

        <section id="perfil" className="grid items-center gap-8 rounded-[18px] bg-[#f0e9e4] p-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-sm rounded-[16px] border border-[#e6ded8] bg-white p-3 shadow-[0_10px_20px_rgba(61,51,45,0.08)]">
            <span className="absolute left-4 top-[-10px] rounded-full bg-[#f1e7e3] px-3 py-1 text-[11px] font-semibold text-[#1d1b18]">
              Psicologa recomendada
            </span>
            <img
              src={profileImg}
              alt="Retrato de la psicologa"
              className="h-64 w-full rounded-[12px] object-cover"
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-2xl text-[#1d1b18]">
              Maria Silvia Milanese
            </h2>
            <p className="text-sm font-semibold text-[#6f6a64]">
              Argentina · Psicologia Positiva
            </p>
            <p className="text-sm text-[#6f6a64]">
              Soy Silvia, psicologa con mas de 20 anos de experiencia en
              acompanamiento emocional y desarrollo personal. Trabajo con un
              enfoque practico y humano para ayudarte a construir bienestar
              sostenible.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-[#e6ded8] bg-[#f7f5f2] px-3 py-1">
                Adultos y parejas
              </span>
              <span className="rounded-full border border-[#e6ded8] bg-[#f7f5f2] px-3 py-1">
                Mindfulness
              </span>
              <span className="rounded-full border border-[#e6ded8] bg-[#f7f5f2] px-3 py-1">
                TCC aplicada
              </span>
            </div>
          </div>
        </section>

        <section id="porque" className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl text-[#1d1b18]">Por que trabajar conmigo?</h2>
            <p className="text-sm text-[#6f6a64]">
              Un metodo claro y herramientas concretas desde la primera sesion.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="rounded-[14px] border border-[#e6ded8] bg-white p-4 shadow-[0_10px_20px_rgba(61,51,45,0.08)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e7e3] text-[#b78f8f]">
                <span className="text-lg">★</span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1b18]">Experiencia clinica</h3>
              <p className="text-sm text-[#6f6a64]">
                Mas de 15 anos ayudando a personas y familias a recuperar equilibrio emocional.
              </p>
            </div>
            <div className="rounded-[14px] border border-[#e6ded8] bg-white p-4 shadow-[0_10px_20px_rgba(61,51,45,0.08)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e7e3] text-[#b78f8f]">
                <span className="text-lg">✦</span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1b18]">Herramientas practicas</h3>
              <p className="text-sm text-[#6f6a64]">
                Tecnicas de autocuidado y acciones concretas para aplicar en el dia a dia.
              </p>
            </div>
            <div className="mx-auto rounded-[14px] border border-[#e6ded8] bg-white p-4 shadow-[0_10px_20px_rgba(61,51,45,0.08)] md:col-span-2 md:max-w-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e7e3] text-[#b78f8f]">
                <span className="text-lg">❖</span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1b18]">Bienestar sostenible</h3>
              <p className="text-sm text-[#6f6a64]">
                Sesiones enfocadas en cambios reales y seguimiento continuo.
              </p>
            </div>
          </div>
        </section>

        <section id="ayuda" className="space-y-6 rounded-[18px] bg-[#f0e9e4] p-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl text-[#1d1b18]">En que puedo ayudarte?</h2>
            <p className="text-sm text-[#6f6a64]">Casos comunes que abordamos en terapia positiva.</p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-3 text-[12px] md:grid-cols-3">
            {[
              'Gestionar ansiedad y estres',
              'Fortalecer autoestima',
              'Mejorar relaciones',
              'Superar bloqueos emocionales',
              'Crear habitos saludables',
              'Procesar duelos y cambios',
            ].map((item) => (
              <span
                key={item}
                className="rounded-[12px] border border-[#e6ded8] bg-white px-3 py-2 text-center"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="metodo" className="space-y-6">
          <div className="mx-auto grid max-w-4xl items-center gap-6 rounded-[18px] border border-[#e6ded8] bg-white p-5 shadow-[0_10px_20px_rgba(61,51,45,0.08)] md:grid-cols-2">
            <img src={methodImg} alt="Psicologa en consulta" className="h-64 w-full rounded-[12px] object-cover md:h-72" />
            <div className="space-y-3">
              <h2 className="font-heading text-2xl text-[#1d1b18]">Sobre el metodo BePositive</h2>
              <p className="text-sm text-[#6f6a64]">
                Un enfoque centrado en fortalezas, accion consciente y herramientas que te ayudan a crear cambios profundos.
              </p>
              <button className="rounded-full bg-[#f1e7e3] px-4 py-2 text-xs font-semibold text-[#1d1b18]">
                Conocer el metodo
              </button>
            </div>
          </div>
        </section>

        <section id="pilares" className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl text-[#1d1b18]">Los 3 pilares del metodo</h2>
            <p className="text-sm text-[#6f6a64]">Un enfoque practico para construir bienestar duradero.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-3">
            {[
              ['Autoconocimiento', 'Reconoce patrones y fortalezas para decidir mejor.', '◎'],
              ['Actitud de cambio', 'Disena habitos que sostienen tu bienestar.', '◈'],
              ['Habitos felices', 'Practicas diarias que transforman tu rutina.', '◐'],
            ].map(([title, text, icon]) => (
              <div key={title} className="rounded-[12px] border border-[#e6ded8] bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e7e3] text-[#b78f8f]">
                  <span className="text-sm">{icon}</span>
                </div>
                <h3 className="text-base font-semibold text-[#1d1b18]">{title}</h3>
                <p className="text-sm text-[#6f6a64]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="funciona" className="space-y-10 rounded-[18px] bg-[#f0e9e4] p-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl text-[#1d1b18]">Como funciona?</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-10 text-center md:grid-cols-3">
            {[
              ['1', 'Primera consulta gratuita', 'Nos conocemos sin compromiso. Hablamos sobre lo que te preocupa y como puedo ayudarte.'],
              ['2', 'Disenamos tu camino', 'Juntos creamos un plan personalizado que se adapta a tu ritmo y necesidades.'],
              ['3', 'Acompanamiento continuo', 'Sesiones disenadas para que veas resultados y te sientas apoyado en cada paso.'],
            ].map(([num, title, text]) => (
              <div key={title} className="space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#b78f8f] text-white text-lg font-semibold">
                  {num}
                </div>
                <h3 className="text-base font-semibold text-[#1d1b18]">{title}</h3>
                <p className="text-sm text-[#6f6a64] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonios" className="space-y-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl text-[#1d1b18]">Lo que dicen nuestros pacientes</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                text: '"Despues de meses sintiendome perdida, encontre en el metodo BePositive las herramientas que necesitaba. Hoy me siento mas fuerte y segura de mi misma."',
                name: 'Maria G.',
                country: 'Mexico',
              },
              {
                text: '"No pense que la terapia pudiera ser tan transformadora. El enfoque en mis fortalezas me ayudo a ver todo desde otra perspectiva."',
                name: 'Carlos R.',
                country: 'Espana',
              },
              {
                text: '"Gracias al acompanamiento empatico y profesional, pude superar momentos muy dificiles. Me siento renovada y con esperanza."',
                name: 'Laura S.',
                country: 'Argentina',
              },
            ].map((item) => (
              <div key={item.name} className="rounded-[14px] border border-[#e6ded8] bg-white p-5 shadow-[0_10px_20px_rgba(61,51,45,0.08)]">
                <p className="text-sm italic text-[#6f6a64] leading-relaxed">{item.text}</p>
                <div className="mt-4 border-t border-[#e6ded8] pt-4">
                  <p className="text-sm font-semibold text-[#1d1b18]">{item.name}</p>
                  <p className="text-xs text-[#6f6a64]">{item.country}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="agenda" className="space-y-6 rounded-[18px] bg-[#f0e9e4] p-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl text-[#1d1b18]">Agenda tu consulta inicial gratuita</h2>
            <p className="text-sm text-[#6f6a64]">
              Selecciona la fecha y hora que mejor te convenga para tu primera sesion con Maria Silvia Milanese
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl rounded-[18px] border border-[#e6ded8] bg-white p-6 shadow-[0_18px_36px_rgba(61,51,45,0.15)]">
            <div className="mx-auto flex max-w-xs justify-center gap-2">
              <span className="h-2 w-16 rounded-full bg-[#b78f8f]"></span>
              <span className="h-2 w-16 rounded-full bg-[#f1e7e3]"></span>
              <span className="h-2 w-16 rounded-full bg-[#f1e7e3]"></span>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e6ded8] bg-[#f7f5f2] text-[#b78f8f]">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1b18]">Selecciona Fecha y Hora</h3>
              <p className="text-xs text-[#6f6a64]">Elige el momento que mejor te convenga para tu consulta</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[14px] border border-[#e6ded8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1d1b18]">
                  <span>📅</span> Selecciona la fecha
                </div>
                <div className="mt-3 rounded-[12px] border border-[#e6ded8] p-3">
                  <div className="mb-3 flex items-center justify-between text-xs text-[#6f6a64]">
                    <button className="rounded-full border border-[#e6ded8] px-2 py-1">‹</button>
                    <span className="font-semibold text-[#1d1b18]">March 2026</span>
                    <button className="rounded-full border border-[#e6ded8] px-2 py-1">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-[11px] text-[#6f6a64]">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-center">
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className={`rounded-[10px] px-2 py-2 text-center ${
                          i === 18
                            ? 'bg-[#b78f8f] text-white'
                            : 'bg-[#f7f5f2] text-[#6f6a64]'
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-[14px] border border-[#e6ded8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1d1b18]">
                  <span>⏰</span> Selecciona la hora
                </div>
                <div className="mt-3 rounded-[12px] border border-[#e6ded8] bg-[#f7f5f2] p-3 text-xs text-[#1d1b18]">
                  <p className="font-semibold">Tu zona horaria: America/Lima</p>
                  <div className="mt-2 flex items-center justify-between rounded-[10px] border border-[#e6ded8] bg-white px-3 py-2">
                    <span>PE Peru (GMT-5)</span>
                    <span>▾</span>
                  </div>
                  <p className="mt-2 text-[11px] text-[#6f6a64]">
                    Todos los horarios se muestran en TU zona horaria local
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    '07:00 (No disponible)',
                    '07:30 (No disponible)',
                    '08:00 (No disponible)',
                    '13:00 (No disponible)',
                    '13:30 (No disponible)',
                    '14:00 (No disponible)',
                    '14:30 (No disponible)',
                  ].map((hour) => (
                    <div key={hour} className="rounded-[10px] border border-[#e6ded8] bg-white px-3 py-2 text-xs text-[#6f6a64]">
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-[10px] bg-[#b78f8f] px-6 py-2 text-xs font-semibold text-white">
                Continuar
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl border-t border-[#e6ded8] px-4 py-8 text-sm text-[#6f6a64]">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="font-semibold text-[#1d1b18]">Abigail Conecta Contigo</p>
            <p>Plataforma de reservas para psicologia y bienestar emocional.</p>
          </div>
          <div className="flex gap-4">
            <a href="#">Politicas</a>
            <a href="#">Privacidad</a>
            <a href="#">Ayuda</a>
          </div>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 flex items-center gap-2 rounded-full bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(61,51,45,0.08)]">
        <span className="h-2 w-2 rounded-full bg-[#c8a5a5]"></span>
        Chat
      </button>
    </div>
  )
}

export default App
