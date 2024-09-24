import React from 'react';
import "./Contact.css";
const Contacto = () => {
        return (
            <div className="contact-container">
              <div className="container">
                <h1 className="text-center mb-5">Contáctanos</h1>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="name" required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" id="email" required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">Mensaje</label>
                        <textarea className="form-control" id="message" rows="5" required></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
                    </form>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h3>Información de Contacto</h3>
                    <p><i className="fas fa-map-marker-alt"></i> El terrero Zona 4</p>
                    <p><i className="fas fa-phone"></i> +502 3388 9257</p>
                    <p><i className="fas fa-envelope"></i> aproagua@google.com</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        

export default Contacto;
