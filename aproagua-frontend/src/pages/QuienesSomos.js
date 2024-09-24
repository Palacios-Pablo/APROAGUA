import React from 'react';
import './About.css';
const QuienesSomos = () => {
    return (
        <div className="about-container">
          <div className="container">
            <h1 className="text-center mb-5">Quienes Somos</h1>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h2>Nuestra Misión</h2>
                <p>En Aproagua, nos dedicamos a proporcionar agua potable de calidad a todas las comunidades, promoviendo la salud y el bienestar de las personas mientras cuidamos nuestros recursos hídricos.</p>
              </div>
              <div className="col-md-6 mb-4">
                <h2>Nuestra Visión</h2>
                <p>Aspiramos a ser líderes en la gestión sostenible del agua, innovando constantemente para garantizar un futuro donde cada individuo tenga acceso a agua limpia y segura.</p>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <h2 className="text-center mb-4">Nuestros Valores</h2>
                <div className="values-container">
                  <div className="value-item">
                    <i className="fas fa-hand-holding-water fa-2x"></i>
                    <h3>Responsabilidad</h3>
                  </div>
                  <div className="value-item">
                    <i className="fas fa-seedling fa-2x"></i>
                    <h3>Sostenibilidad</h3>
                  </div>
                  <div className="value-item">
                    <i className="fas fa-users fa-2x"></i>
                    <h3>Comunidad</h3>
                  </div>
                  <div className="value-item">
                    <i className="fas fa-lightbulb fa-2x"></i>
                    <h3>Innovación</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    

export default QuienesSomos;
