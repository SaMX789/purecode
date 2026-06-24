import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Registro from './Registro.jsx' // Tu nuevo archivo de Registro
import Dashboard from './Dashboard.jsx'
import Conexion from './Conexion.jsx'
import Registros from './Registros.jsx'
import Perfil from './Perfil.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Cuando el usuario entre a la ruta principal "/", se mostrará tu App.jsx (Login) */}
        <Route path="/" element={<App />} />
        {/* Cuando el usuario vaya a "/registro", se mostrará el componente Registro */}
        <Route path="/registro" element={<Registro />} />
        {/* Creamos la ruta para el dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Creamos la ruta para la página de conexión */}
        <Route path="/conexion" element={<Conexion />} />
        {/* Creamos la ruta para la página de registros */}
        <Route path="/registros" element={<Registros />} />
        {/* Creamos la ruta para la página de perfil */}
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  </StrictMode>,
)
