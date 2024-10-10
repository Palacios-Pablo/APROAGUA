import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Modal from 'react-modal';  // Importar react-modal

import Navbar from './components/Navbar';   // Navbar para las páginas públicas
import DashboardLayout from './components/DashboardLayout';  // Layout con Sidebar
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import QuienesSomos from './pages/QuienesSomos';
import Tarifas from './pages/Tarifas';

// Páginas del sistema de gestión
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';  // Cambiar a ClientesPage
import Consumo from './pages/Consumo';
import Facturacion from './pages/Facturacion';
import Pagos from './pages/Pagos';
import Reportes from './pages/Reportes';
import Finanzas from './pages/Finanzas';
import EgresosPage from './pages/EgresosPage';

Modal.setAppElement('#root');  // Establece el elemento raíz de la aplicación

// Componente para mostrar el Navbar solo en rutas públicas
function AppLayout({ children }) {
    const location = useLocation();
    
    // Ocultar el Navbar en rutas que incluyan "/dashboard", "/clientes", etc.
    const hideNavbar = location.pathname.startsWith('/dashboard') || 
                       location.pathname.startsWith('/clientes') || 
                       location.pathname.startsWith('/consumo') || 
                       location.pathname.startsWith('/facturacion') || 
                       location.pathname.startsWith('/pagos') || 
                       location.pathname.startsWith('/reportes') || 
                       location.pathname.startsWith('/finanzas') ||
                       location.pathname.startsWith('/tarifas') ||
                       location.pathname.startsWith('/egresos');

    return (
        <>
            {!hideNavbar && <Navbar />}  {/* Solo muestra el Navbar si no estamos en una ruta protegida */}
            {children}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/quienes-somos" element={<QuienesSomos />} />

                    {/* Rutas del sistema de gestión con Sidebar */}
                    <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
                    <Route path="/clientes" element={<DashboardLayout><ClientesPage /></DashboardLayout>} />
                    <Route path="/consumo" element={<DashboardLayout><Consumo /></DashboardLayout>} />
                    <Route path="/facturacion" element={<DashboardLayout><Facturacion /></DashboardLayout>} />
                    <Route path="/pagos" element={<DashboardLayout><Pagos /></DashboardLayout>} />
                    <Route path="/reportes" element={<DashboardLayout><Reportes /></DashboardLayout>} />
                    <Route path="/finanzas" element={<DashboardLayout><Finanzas /></DashboardLayout>} />
                    <Route path="/tarifas" element={<DashboardLayout><Tarifas /></DashboardLayout>} />
                    <Route path="/egresos" element={<DashboardLayout><EgresosPage /></DashboardLayout>} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
