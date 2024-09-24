import React from 'react';

const DashboardPage = () => {
    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Dashboard General</h1>
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>150</h3>
                                    <p>Clientes Registrados</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-users"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>53,000 L</h3>
                                    <p>Agua Consumida</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-water"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>44</h3>
                                    <p>Facturas Pendientes</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-file-invoice"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>$65,000</h3>
                                    <p>Pagos Recibidos</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
