# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Variables requeridas para mensajes de clientes

La implementación gratuita del módulo de mensajes usa Firestore directo desde el frontend. No requiere Firebase Functions ni variables adicionales fuera de las credenciales Firebase ya configuradas en `.env`.

Protecciones incluidas en esta versión:

- validaciones de formulario en cliente
- honeypot invisible
- tiempo mínimo antes de enviar
- control local de frecuencia
- validaciones de estructura en `firestore.rules`

La colección usada para los leads es `client_messages`.




# Documentacion tecnica: sistema de reserva de citas con IA

## 1. Introduccion

### Descripcion del sistema
El sistema de reservas de citas es una plataforma web que permite a usuarios gestionar citas de manera eficiente con servicios o profesionales (por ejemplo, clinicas, consultorios, centros de belleza). El sistema ofrece un frontend en React con interfaz dinamica y un backend basado en Firebase que gestiona autenticacion, base de datos en tiempo real y despliegue. Ademas, integra un componente de inteligencia artificial (IA) que actua como asistente para sugerir horarios y facilitar el proceso de reserva.

### Objetivo del proyecto
El objetivo es ofrecer un flujo de reserva rapido, confiable y automatizado, reduciendo la friccion del usuario y mejorando la eficiencia operativa del negocio. Se busca integrar IA para:
- Guiar al usuario durante el proceso de reserva.
- Recomendar horarios disponibles segun preferencias.
- Reducir la carga administrativa.

### Problema que resuelve
La gestion manual de citas suele generar errores, duplicidades y perdida de tiempo. El sistema automatiza el proceso, mejora la experiencia del cliente y permite una administracion centralizada de disponibilidad. La IA agrega un nivel de personalizacion y soporte que reduce abandonos durante la reserva.

## 2. Descripcion del componente de IA

### Tipo de IA utilizada
Se propone un asistente conversacional (chatbot) con capacidades de recomendacion. Este asistente:
- Interpreta la intencion del usuario (reservar, cambiar, cancelar).
- Sugiere horarios disponibles basados en preferencias (fecha, hora, profesional).

### Como se integra en el sistema de reservas
La IA se integra como un servicio que se comunica con la interfaz de React y con Firebase:
- React gestiona la conversacion UI.
- Firebase Functions actua como gateway hacia el modelo de IA (puede ser un API externo o un modelo propio).
- Firestore almacena contexto conversacional y preferencias del usuario.

### Flujo de interaccion con el usuario
1. El usuario inicia una conversacion: "Quiero agendar para el jueves".
2. La IA consulta disponibilidad (Firestore).
3. Sugiere opciones: "Disponibles 10:00 y 15:00".
4. El usuario selecciona una opcion.
5. El sistema crea la cita en Firestore.

## 3. Arquitectura del sistema

### Explicacion general
- **Frontend (React):** interfaz para usuarios y administradores.
- **Backend (Firebase):** autenticacion, base de datos, funciones serverless y hosting.
- **Servicio IA:** API para procesamiento del lenguaje natural y recomendaciones.

### Diagrama logico (explicado en texto)
Usuario -> React UI -> Firebase Auth (login) -> Firestore (lectura/escritura) ->
Firebase Functions (logica IA) -> API IA -> Respuesta -> React UI

### Comunicacion entre React y Firebase
- React utiliza Firebase SDK.
- Se autentica con Firebase Auth.
- Interactua con Firestore en tiempo real para:
  - Listar disponibilidad.
  - Crear y modificar citas.
- Invoca Firebase Functions para operaciones sensibles o para consultar la IA.

## 4. Tecnologias utilizadas

### React
- **Estructura:** componentes funcionales, separacion por modulos (Auth, Citas, Admin).
- **Hooks:** `useState`, `useEffect`, `useContext` para estado global.
- **Routing:** `react-router-dom` para navegacion por secciones.
- **Gestion de estado:** Context API o Zustand/Redux segun complejidad.

### Firebase
- **Authentication:** registro, login, roles.
- **Firestore:** base de datos NoSQL en tiempo real.
- **Hosting:** despliegue frontend.
- **Functions:** backend serverless, integracion con IA.

### Librerias adicionales
- `date-fns` o `dayjs`: manejo de fechas.
- `react-hook-form`: formularios.
- `zod` o `yup`: validacion.
- `firebase` SDK.
- Cliente HTTP (`axios` o `fetch`).

### Estructura de carpetas recomendada (React)

```text
src/
  app/
    App.jsx
    routes.jsx
    providers/
    layouts/
  assets/
    images/
    icons/
    styles/
      variables.css
      globals.css
  components/
    common/
    forms/
    feedback/
    navigation/
  features/
    auth/
    public/
    appointments/
    ai-assistant/
    admin/
    client/
  services/
    firebase/
    api/
  hooks/
  utils/
  data/
  pages/
  tests/
```

- `features/`: modulos funcionales (cada feature con componentes, hooks y estado propio).
- `services/`: integraciones externas (Firebase, IA, pagos).
- `components/`: componentes reutilizables por categoria.
- `app/`: rutas, layouts y providers globales.

## 5. Modulos del sistema

### Modulo publico (acceso general)
- Home con propuesta de valor y llamada a la accion clara.
- Catalogo de servicios con descripcion, duracion, precio y requisitos.
- Busqueda y filtros por servicio, profesional, fecha, horario y ubicacion.
- Vista de disponibilidad general con horarios sugeridos y proximas aperturas.
- Perfil publico de profesionales con especialidad, idiomas y calificaciones.
- Testimonios, preguntas frecuentes y politicas (cancelacion, no asistencia).
- Pagina de contacto con canales de soporte y horarios de atencion.
- SEO basico: metadatos, URLs legibles y schema de negocio local.
- Registro e inicio de sesion con opcion de continuar como invitado.

#### Flujos clave (publico)
1. Descubrimiento -> filtro -> vista de disponibilidad -> registro.
2. Seleccion de servicio -> perfil profesional -> horario sugerido -> inicio de sesion.
3. Consulta de politicas -> contacto -> soporte.

### Modulo cliente (dashboard)
- Panel con proximas citas, estados y acciones rapidas.
- Flujo guiado para crear, reprogramar y cancelar citas.
- Preferencias del usuario (horarios, profesional favorito, canales).
- Historial de citas con comprobantes y notas asociadas.
- Notificaciones configurables (email/SMS/WhatsApp) y recordatorios.
- Pagos y facturacion (si aplica): metodos guardados y comprobantes.
- Mensajeria con soporte o profesional (si se habilita).
- Asistente IA integrado para sugerencias y resolucion de dudas.
- Accesos rapidos a politicas y consentimientos.

#### Flujos clave (cliente)
1. Login -> panel -> nueva cita -> confirmacion.
2. Login -> historial -> reprogramar -> confirmacion.
3. Login -> notificaciones -> actualizar preferencias -> guardar.

### Modulo administrador (dashboard)
- Agenda diaria/semanal con filtros por servicio, profesional y sede.
- Gestion de servicios, duraciones, precios y requisitos.
- Gestion de profesionales con perfiles, especialidades y capacidad.
- Configuracion de disponibilidad, excepciones, feriados y buffers.
- Administracion de reservas: reasignar, bloquear, confirmar o cancelar.
- Reportes basicos (ocupacion, cancelaciones, ingresos, no asistencia).
- Gestion de usuarios y roles con permisos granulares.
- Configuracion de notificaciones, plantillas y politicas.
- Panel de integraciones (pagos, calendario externo, IA).

#### Flujos clave (administrador)
1. Login admin -> agenda -> bloquear horario -> guardar.
2. Login admin -> servicio -> editar duracion/precio -> publicar.
3. Login admin -> reportes -> exportar -> compartir.

## 6. Autenticacion y gestion de usuarios

### Registro e inicio de sesion
- Firebase Auth con email/password o proveedores OAuth.
- Flujo tipico: registro -> verificacion -> login.

### Roles
- **Usuario:** reserva y gestiona sus citas.
- **Administrador:** configura horarios, ve reportes, gestiona usuarios.

Los roles se manejan mediante:
- Claims personalizados en Firebase Auth.
- Campo `role` en el documento de usuario.

### Seguridad basica
- Reglas de Firestore limitan acceso por rol.
- Functions validan permisos antes de operaciones criticas.

## 7. Modulo de reserva de citas

### Creacion, edicion y cancelacion
- Crear cita con seleccion de fecha/hora/profesional.
- Editar permite reprogramar si existe disponibilidad.
- Cancelar libera el horario.

### Validaciones
- No permitir fechas pasadas.
- Bloquear horarios ocupados.
- Validar duracion y rango permitido.

### Manejo de disponibilidad
- Firestore mantiene coleccion de disponibilidad.
- La logica en Functions valida no duplicidad.

## 8. Integracion de la IA

### Ejemplo: asistente que ayuda a agendar citas
El asistente solicita preferencias:
- Fecha deseada.
- Horario preferido.
- Profesional o servicio.

### Flujo paso a paso
1. Usuario: "Quiero una cita el lunes".
2. IA: "Manana o tarde?"
3. Usuario: "Manana".
4. IA: consulta Firestore, devuelve opciones.
5. Usuario elige.
6. Se crea la cita en Firestore.

### Ejemplo de interaccion
Usuario: "Necesito una cita para el viernes por la tarde."
IA: "Tengo disponible viernes 16:00 o 17:30. Cual prefieres?"
Usuario: "17:30."
IA: "Perfecto, tu cita fue agendada para viernes 17:30."

## 9. Modelo de datos (Firestore)

### Colecciones principales
- `users`
- `appointments`
- `availability`
- `services`
- `conversations`

### Ejemplo de estructura JSON

```json
{
  "appointments": {
    "appointmentId123": {
      "userId": "userId456",
      "serviceId": "service789",
      "professionalId": "prof123",
      "date": "2026-03-20",
      "time": "17:30",
      "status": "confirmed",
      "createdAt": "2026-03-18T10:20:00Z"
    }
  }
}
```

## 10. Despliegue

### Como desplegar en Firebase Hosting
1. `npm run build`
2. `firebase login`
3. `firebase init`
4. `firebase deploy`

### Configuracion basica
- Configurar `firebase.json` para SPA.
- Usar variables de entorno para endpoints IA.

## 11. Pruebas

### Tipos de pruebas recomendadas
- **Unitarias:** logica de validacion.
- **Integracion:** Firestore + Functions.
- **E2E:** flujo de reserva completo.

### Casos basicos
- Registro y login correcto.
- Crear cita en horario disponible.
- Rechazo en horario ocupado.
- Cancelacion de cita.

## 12. Escalabilidad y mejoras futuras

### Posibles mejoras del sistema
- Integrar calendario externo (Google Calendar).
- Notificaciones por email/SMS.
- IA con aprendizaje de preferencias.

### Optimizacion
- Indexes en Firestore para consultas rapidas.
- Lazy loading en React.
- CDN en Firebase Hosting.

## 13. Estilos y experiencia visual (web y movil)

### Direccion visual
- Enfoque de "calma y confianza" con paleta neutra y acento rosa palido `#C8A5A5`.
- Evitar colores demasiado saturados o contrastes agresivos.
- Ilustraciones o iconografia simple para reforzar claridad.

### Paleta recomendada
- Primario: `#C8A5A5` (rosa palido, acento principal).
- Secundario: `#6F6A64` (texto secundario).
- Fondo: `#F7F5F2` (superficie base).
- Superficie: `#FFFFFF` (tarjetas y paneles).
- Texto: `#1D1B18` (texto principal).
- Bordes: `#E6DED8` (divisiones suaves).

### Tipografia
- Titulos con serif moderna (por ejemplo, Playfair Display).
- Cuerpo con sans legible (por ejemplo, Source Sans 3).
- Jerarquia clara: H1 32-40px, H2 24-28px, H3 20-22px, cuerpo 16-18px.

### Layout y componentes
- Grid de 12 columnas en desktop y 4 columnas en movil.
- Tarjetas modulares para servicios, profesionales y citas.
- Calendario visual con chips de filtros y estados claros.
- Botones con area tactil >= 44px y foco visible.

### Feedback e interaccion
- Transiciones suaves (150-250ms) y estados de carga tipo skeleton.
- Mensajes de error y confirmacion visibles, con acciones sugeridas.
- Estados vacios con CTA y ejemplos.

### Accesibilidad
- Contraste AA, foco visible y navegacion por teclado.
- Texto minimo 16px y espaciado de 1.5-1.7.
- Etiquetas claras en formularios y ayudas contextuales.

### Patrones mobile-first
- Navegacion inferior con 3-4 acciones principales.
- Flujo de reserva en pasos (servicio -> profesional -> horario -> confirmar).
- Calendario compacto con scroll horizontal y selector rapido.
- CTA persistente en la zona inferior en pasos criticos.

## 14. Mejoras adicionales y consideraciones

### Roadmap por fases (priorizacion sugerida)
- **Fase 1 (MVP):** autenticacion, agenda base, reservas, panel admin basico.
- **Fase 2:** IA conversacional, recordatorios, reprogramacion.
- **Fase 3:** pagos, reportes avanzados, multi-sede.
- **Fase 4:** personalizacion IA, integraciones externas, analitica avanzada.

### Experiencia de reserva
- Calendario con vista semanal y diaria, mas filtros por servicio y profesional.
- Confirmacion rapida con un flujo de 1 o 2 pasos maximos.
- Recordatorios contextuales antes de finalizar la reserva.

### IA y automatizacion
- Deteccion de intencion (agendar, reprogramar, cancelar) desde el chat.
- Reprogramacion automatica con sugerencias segun historial.
- Personalizacion de recomendaciones por preferencias y disponibilidad real.

### Notificaciones y comunicacion
- Email/SMS/WhatsApp para confirmacion, recordatorios y cambios.
- Plantillas de mensajes con variables dinamicas.
- Ventanas de no molestar y opt-in del usuario.

### Pagos y politicas comerciales
- Integracion con pasarelas (Stripe o Mercado Pago).
- Anticipos, pagos completos y politica de cancelacion automatizada.
- Comprobantes y facturacion basica.

### Panel administrativo
- Gestion de disponibilidad por bloques, ausencias y buffers entre citas.
- Reglas por servicio (duracion, tiempos de preparacion, maximo diario).
- Reportes de ocupacion, cancelaciones y no asistencia.

### Escalabilidad funcional
- Soporte multi-sede y multi-profesional.
- Asignacion automatica de recursos (salas o equipos).
- Vista unificada para administradores regionales.

### Accesibilidad y UX
- Navegacion completa por teclado y soporte lector de pantalla.
- Contrastes adecuados y tamanos de texto configurables.
- Formularios con validacion clara y mensajes accionables.

### Observabilidad y calidad
- Logs en Functions con trazas de negocio.
- Alertas ante errores de reserva o caidas de servicios externos.
- Metricas: tasa de conversion, cancelaciones y tiempos de espera.

### Seguridad y cumplimiento
- Reglas estrictas de Firestore por rol y propiedad de datos.
- Validaciones server-side en Functions.
- Politicas de retencion de datos y privacidad.

### Performance
- Cache de consultas frecuentes y paginacion.
- Indexes en Firestore para consultas criticas.
- Precarga de datos clave en vistas de agenda.

## 15. Conclusion
El sistema de reservas con React y Firebase brinda una solucion moderna, flexible y escalable. La integracion de IA agrega valor al proceso de reserva, reduciendo friccion para el usuario y automatizando tareas para la administracion. Esta arquitectura permite crecer con facilidad y adaptarse a necesidades futuras, manteniendo un equilibrio entre simplicidad, rendimiento y experiencia.
