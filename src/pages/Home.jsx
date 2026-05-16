import { useState } from 'react'
import { Link } from 'react-router-dom'

import ContactRequestModal from '../components/ContactRequestModal.jsx'

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F2] dark:bg-stone-950 border-b border-[#F0E9E4] dark:border-stone-800 shadow-[0_20px_40px_rgba(111,106,100,0.08)]">
        <div className="flex justify-between items-center w-full max-w-[1140px] mx-auto h-20 px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Conecta Contigo Logo" className="h-12 w-auto object-contain" />
            <span className="text-xl font-bold font-serif text-[#6F6A64] dark:text-[#F0E9E4]">Psic. Abigail Conecta Contigo</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-[#6F6A64] dark:text-stone-400 font-label-md text-label-md hover:text-[#B78F8F] transition-colors" href="#about">Sobre Mí</a>
            <a className="text-[#6F6A64] dark:text-stone-400 font-label-md text-label-md hover:text-[#B78F8F] transition-colors" href="#services">Especialidades</a>
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-all"
            >
              Agendar gratis
            </button>
          </div>
          <button 
            className="md:hidden text-on-surface"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F7F5F2] border-b border-[#F0E9E4] px-6 pb-4 flex flex-col gap-3">
            <a className="text-[#6F6A64] hover:text-[#B78F8F]" href="#about" onClick={() => setMobileMenuOpen(false)}>Sobre Mí</a>
            <a className="text-[#6F6A64] hover:text-[#B78F8F]" href="#services" onClick={() => setMobileMenuOpen(false)}>Especialidades</a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                setContactModalOpen(true)
              }}
              className="rounded-full bg-primary-container px-4 py-2 text-left text-sm font-semibold text-on-primary-container"
            >
              Solicitar consulta
            </button>
          </div>
        )}
      </header>

      <main className="mt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md">
                <span className="material-symbols-outlined text-sm" data-icon="verified">verified</span>
                Psicóloga Abigail Sánchez Ávila
              </div>
              <h1 className="font-display text-display text-on-surface leading-tight">
                Tu bienestar emocional es mi <span className="text-primary italic">prioridad</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Bienvenidos a un espacio seguro donde tu bienestar emocional es la prioridad. Con un enfoque empático y profesional, te acompaño en tu proceso de crecimiento personal. Mi compromiso es brindarte herramientas efectivas para enfrentar los desafíos de la vida, promoviendo tu salud mental y desarrollo integral en un ambiente de confianza y respeto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Solicitar consulta
                  <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                </button>
                <button className="border border-outline text-on-surface px-8 py-4 rounded-full font-label-md text-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
                  Ver enfoque
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <img alt="Abigail Sánchez Ávila" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-alt="Professional psychologist smiling warmly in a bright modern office" 
                  src="/psicologa.jpeg"/>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary-container p-6 rounded-2xl shadow-xl border border-outline-variant max-w-[200px] ">
                <p className="font-label-md text-[14px] text-on-surface leading-tight font-bold ">Atención psicológica personalizada y profesional.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Me: Bento Style */}
        <section className="py-section-gap bg-surface-container-low" id="about">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-8 bg-surface-container-lowest p-10 rounded-[2rem] border border-outline-variant flex flex-col justify-between">
                <div>
                  <h2 className="font-headline-lg text-headline-lg mb-6">Ps. Abigail Sánchez Ávila</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                    Soy una profesional de la salud mental con formación en la Universidad César Vallejo. Me caracterizo por un enfoque empático, responsable y comprometido.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">Terapia Individual</span>
                    <span className="px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">Terapia Cognitivo-Conductual</span>
                    {/* <span className="px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">Enfoque sistémico</span> */}
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 bg-primary text-on-primary p-10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                <p className="font-headline-md text-headline-md mb-2">Mis Fortalezas</p>
                <p className="font-label-md text-label-md opacity-80">Empatía, Responsabilidad, Espacio seguro y Trabajo en equipo</p>
              </div>
              <div className="md:col-span-4 bg-tertiary text-on-tertiary p-10 rounded-[2rem] flex flex-col justify-end min-h-[300px] relative overflow-hidden">
                <span className="material-symbols-outlined text-8xl absolute -top-4 -right-4 opacity-10" data-icon="favorite">favorite</span>
                <h3 className="font-headline-md text-headline-md mb-4">Mi Compromiso Profesional</h3>
                <p className="text-sm opacity-90">Mi enfoque se centra en crear un ambiente de confianza donde cada paciente pueda expresarse libremente. Trabajo con dedicación para acompañarte en tu proceso de sanación y desarrollo personal.</p>
              </div>
              <div className="md:col-span-8 bg-[#F0E9E4] dark:bg-stone-900 p-10 rounded-[2rem] border border-outline-variant flex items-center gap-8">
                <div className="hidden sm:block w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img alt="Therapy space" className="w-full h-full object-cover" data-alt="Interior of a calm therapy room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9c6qqZprGIK2NDv9hGkGnQMGxnkXx1BL8AA_E7ZgDfTYoaMTJfscW9Gz5rehayyAIvy6pSeKJGda0VL1urdz1EnEjytkc7KVw547v4j9kuFAIqUEVC3MpiU-HC8DOF8gCUoRHOTtBcfKi9nCpiMbX7mKZN1kr4BDUDWVbnM5URJWhWZJjwf9ssSNOjGqGz8EDEnL1vT4CMBIF81vm1s3WDLf31UFN049aBNtytTMI6Aaoz_Q-B1XX55qrGTN6KAQ3x-3CD-kWJOi"/>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">Sesiones orientadas a tu bienestar</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Cada sesión está diseñada para brindarte las herramientas necesarias para tu bienestar emocional. Orientada a brindar un espacio seguro y profesional para tu desarrollo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How I Can Help */}
        <section className="py-section-gap" id="services">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-display mb-6">Especialidades y Servicios</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Mi práctica se fundamenta en la Terapia Cognitivo-Conductual (TCC) y el enfoque sistémico, herramientas que permiten abordar de manera estructurada y eficiente diversos desafíos emocionales y conductuales.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cards */}
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="person">person</span>
                <h4 className="font-headline-md text-headline-md mb-3">Terapia Individual</h4>
                <p className="text-on-surface-variant">Proceso personalizado para niños, jóvenes y adultos, brindando un espacio seguro para el crecimiento emocional.</p>
              </div>
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="restaurant">restaurant</span>
                <h4 className="font-headline-md text-headline-md mb-3">Trastornos alimentarios</h4>
                <p className="text-on-surface-variant">Intervención especializada en Trastornos de la Conducta Alimentaria con enfoque actualizado y compasivo.</p>
              </div>
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="psychology">psychology</span>
                <h4 className="font-headline-md text-headline-md mb-3">Terapia Cognitivo Conductual</h4>
                <p className="text-on-surface-variant">Abordaje estructurado y eficiente de diversos desafíos emocionales y de la conducta.</p>
              </div>
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="school">school</span>
                <h4 className="font-headline-md text-headline-md mb-3">Dificultades de aprendizaje</h4>
                <p className="text-on-surface-variant">Evaluación profesional y estrategias personalizadas de intervención educativa adaptadas a cada necesidad.</p>
              </div>
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="extension">extension</span>
                <h4 className="font-headline-md text-headline-md mb-3">Estrategias en TEA</h4>
                <p className="text-on-surface-variant">Apoyo emocional y conductual para el Trastorno del Espectro Autista en contextos familiares y educativos.</p>
              </div>
              <div className="p-8 rounded-3xl border border-outline-variant hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform" data-icon="family_restroom">family_restroom</span>
                <h4 className="font-headline-md text-headline-md mb-3">Enfoque Sistémico</h4>
                <p className="text-on-surface-variant">Herramientas que permiten abordar las dinámicas relacionales y familiares de forma integral.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-section-gap bg-secondary-container/30">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="font-display text-display mb-6"><span className="text-primary italic">Enfoque</span> Terapéutico</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
                  Atención psicológica personalizada y profesional. Acompañamiento personalizado en tu proceso de crecimiento y sanación emocional.
                </p>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-headline-md text-[20px] mb-2">Atención integral</h4>
                      <p className="text-on-surface-variant">Atención orientada al bienestar emocional integral de jóvenes y adultos.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-headline-md text-[20px] mb-2">Evaluación e intervención</h4>
                      <p className="text-on-surface-variant">Evaluación profesional y estrategias personalizadas de intervención educativa.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="font-headline-md text-[20px] mb-2">Apoyo especializado</h4>
                      <p className="text-on-surface-variant">Apoyo emocional y conductual para el Trastorno del Espectro Autista en contextos familiares y educativos.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="aspect-square rounded-full border-[24px] border-surface-container overflow-hidden">
                  <img alt="Enfoque terapéutico" className="w-full h-full object-cover" data-alt="Person practicing yoga in a serene outdoor setting at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-mUH26p6b2rT52mVINTPv4S_IfFz2Zlfbfo8dnq8su1YvkdXh2fthyf647lTIAYDstGz4PPZjniCpVXMjglFCA1uu41o4djvSt6KwHKKwf7cFpVfAcTVd26hevCRPiwLnjilR8mwzdNxUhqEEmueBsaJIBzNujv0dcQrzSPkFgK-xJD1uugiCSgkiLIcCUqXAJJL8ZsQH2j3jxSsi-3BN0u370EC8bbICKvZeJEiCZufUysqx5Jq9cfjNcluI6ZRvHEO23ijmu4S"/>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest p-8 rounded-full shadow-2xl">
                  <span className="material-symbols-outlined text-primary text-5xl" data-icon="bubble_chart">bubble_chart</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-section-gap bg-[#F0E9E4]" id="booking">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="bg-surface-container-lowest rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-2/5 bg-primary p-12 text-on-primary flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-4xl mb-6">Agenda tu cita hoy</h2>
                  <p className="opacity-90 mb-12">Daremos el primer paso juntos. Las citas se programan con anticipación para garantizar una atención personalizada y de calidad.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
                      Atención presencial y virtual disponible
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
                      Lunes a Viernes 3:00 pm - 6:00 pm
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
                      Sábados 9:00 am - 1:00 pm
                    </li>
                  </ul>
                </div>
                <div className="mt-12">
                  <p className="font-label-md text-sm italic">"Tu bienestar emocional es mi prioridad."</p>
                </div>
              </div>
              <div className="lg:w-3/5 p-12 bg-surface flex flex-col justify-center text-center">
                <div className="mb-8">
                  <span className="material-symbols-outlined text-6xl text-primary mb-4" data-icon="contact_support">contact_support</span>
                  <h3 className="font-headline-lg text-headline-lg mb-2">Contáctame</h3>
                  <p className="text-on-surface-variant font-body-lg">Puedes reservar tu sesión escribiéndome o llamando directamente.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary" data-icon="call">call</span>
                    <p className="font-label-md text-lg">953009003</p>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary" data-icon="mail">mail</span>
                    <p className="font-label-md text-center break-all max-w-[200px]">sanchezavilatayamneabigail@gmail.com</p>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary" data-icon="location_on">location_on</span>
                    <p className="font-label-md">Trujillo, La Libertad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F0E9E4] dark:bg-stone-900 border-t border-[#6F6A64]/10 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1140px] mx-auto px-6 gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-lg font-bold font-serif text-[#6F6A64] dark:text-[#F0E9E4]">Abigail Conecta Contigo</span>
            <p className="text-[#6F6A64] dark:text-stone-400 font-serif text-sm max-w-xs text-center md:text-left">Atención psicológica personalizada y profesional. Ps. Abigail Sánchez Ávila.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-[#6F6A64] dark:text-stone-400 font-serif text-sm hover:text-[#B78F8F] transition-all" href="#services">Especialidades</a>
            <a className="text-[#6F6A64] dark:text-stone-400 font-serif text-sm hover:text-[#B78F8F] transition-all" href="#about">Sobre Mí</a>
            <a className="text-[#6F6A64] dark:text-stone-400 font-serif text-sm hover:text-[#B78F8F] transition-all" href="#booking">Agenda tu cita</a>
          </div>
          <div className="flex items-center gap-4">
            <a className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-[#6F6A64] hover:bg-primary-container hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-lg" data-icon="share">share</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-[#6F6A64] hover:bg-primary-container hover:text-white transition-all" href="mailto:sanchezavilatayamneabigail@gmail.com">
              <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
            </a>
          </div>
        </div>
        <div className="w-full max-w-[1140px] mx-auto px-6 mt-12 pt-8 border-t border-[#6F6A64]/10 text-center">
          <p className="text-[#6F6A64] dark:text-stone-400 font-serif text-xs opacity-70">© {new Date().getFullYear()} Ps. Abigail Sánchez Ávila. Todos los derechos reservados.</p>
        </div>
      </footer>
      <ContactRequestModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        source="landing"
      />
    </div>
  )
}

export default Home
