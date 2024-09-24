import React from 'react';
import "./Services.css";
const Servicios = () => {
    return (
        <div className="services-container">
          <div className="container">
            <h1 className="text-center mb-5">Nuestros Servicios</h1>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="service-card">
                  <i className="fas fa-tint fa-3x mb-3"></i>
                  <h3>Suministro de Agua Potable</h3>
                  <p>Proveemos agua limpia y segura a hogares y comunidades.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="service-card">
                  <i className="fas fa-wrench fa-3x mb-3"></i>
                  <h3>Mantenimiento de Red</h3>
                  <p>Mantenemos y reparamos la infraestructura de distribución de agua.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="service-card">
                  <i className="fas fa-leaf fa-3x mb-3"></i>
                  <h3>Gestión Sostenible</h3>
                  <p>Implementamos prácticas sostenibles para conservar los recursos hídricos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    

export default Servicios;
