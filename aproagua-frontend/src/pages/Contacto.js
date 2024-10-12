import React from 'react';
import './Contact.css';

const Contacto = () => {
    return (
        <div className="contact-container">
            <div className="container">
                <h1 className="text-center mb-5">Contáctanos</h1>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <h3>Nuestra Ubicación</h3>
                        {/* Aquí está el mapa de Google */}
                        <div className="google-map">
                        
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d539.8784949896042!2d-91.48855592887395!3d15.332199993351672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDE5JzU2LjYiTiA5McKwMjknMTguNyJX!5e0!3m2!1ses-419!2sgt!4v1728712946078!5m2!1ses-419!2sgt"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <h3>Información de Contacto</h3>
                        <p><i className="fas fa-map-marker-alt"></i> El Terrero Zona 4</p>
                        <p><i className="fas fa-phone"></i> +502 3388 9257</p>
                        <p><i className="fas fa-envelope"></i> aproagua@google.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacto;
