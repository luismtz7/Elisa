// src/components/Login.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import elisaLogo from '../../assets/logowebelisa.svg';
import '../../../src/App.css';

export const LoggedView = () => {

    return (
        <>
        <header>
          <img className='elisalogo' src={elisaLogo} alt="Elisa Logo" />
          <h1 className='elisatitle'>ELISA</h1>
          <nav>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/galeria">Galeria</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
              <li><Link to="/agendar-cita">Agendar Cita</Link></li>
            </ul>
          </nav>
        </header>
      </>
    );
};