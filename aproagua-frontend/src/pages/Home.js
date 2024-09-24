import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Crearemos este archivo para los estilos

function Home() {
  return (
    <div className="home-container">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h1 className="main-title">Refrescando comunidades, una gota a la vez.</h1>
            <p className="main-description">
              Únete a Aproagua en nuestra misión de llevar agua potable de calidad a cada hogar y comunidad. Por un futuro más saludable y sostenible, donde cada gota cuenta.
            </p>
            
          </div>
          
        </div>
      </div>
      <div class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
    </div>
  );
}

export default Home;