import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './providers/AuthProvider.jsx'
import { NotificationProvider } from './providers/NotificationProvider.jsx'
import AdminRoute from './routes/AdminRoute.jsx'
import ClientRoute from './routes/ClientRoute.jsx'
import AdminShell from '../pages/Admin/AdminShell.jsx'
import AdminDashboard from '../pages/Admin/Dashboard.jsx'
import RolesUsers from '../pages/Admin/RolesUsers.jsx'
import RolesPermissions from '../pages/Admin/RolesPermissions.jsx'
import Specialties from '../pages/Admin/Specialties.jsx'
import PsychologistsList from '../pages/Admin/PsychologistsList.jsx'
import PsychologistForm from '../pages/Admin/PsychologistForm.jsx'
import Patients from '../pages/Admin/Patients.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import ClientDashboard from '../pages/Client/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route element={<ClientRoute />}>
                <Route path="/client" element={<ClientDashboard />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminShell />}>
                <Route index element={<AdminDashboard />} />
                <Route path="roles/users" element={<RolesUsers />} />
                <Route path="roles/permissions" element={<RolesPermissions />} />
                <Route path="especialidades" element={<Specialties />} />
                <Route path="psicologos" element={<PsychologistsList />} />
                <Route path="psicologos/nuevo" element={<PsychologistForm />} />
                <Route path="psicologos/editar/:id" element={<PsychologistForm />} />
                <Route path="pacientes" element={<Patients />} />
              </Route>
            </Route>
              <Route path="/cliente" element={<Navigate to="/client" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  )
}

export default App
