import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Modal from 'react-modal';

import Navbar from './components/Navbar';   
import DashboardLayout from './components/DashboardLayout'; 
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import QuienesSomos from './pages/QuienesSomos';
import Tarifas from './pages/Tarifas';
import LoginForm from './components/LoginForm'; // Importar el LoginForm
import RutaProtegida from './components/RutaProtegida'; // Importar RutaProtegida

// Páginas del sistema de gestión
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
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
    
    // Ocultar el Navbar en rutas protegidas
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
                    <Route path="/login" element={<LoginForm />} />  {/* Ruta pública de login */}

                    {/* Rutas protegidas */}
                    <Route
                        path="/dashboard"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><DashboardPage /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/clientes"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><ClientesPage /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/consumo"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><Consumo /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/facturacion"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><Facturacion /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/pagos"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><Pagos /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/reportes"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><Reportes /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/finanzas"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><Finanzas /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/egresos"
                        element={
                            <RutaProtegida>
                                <DashboardLayout><EgresosPage /></DashboardLayout>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
