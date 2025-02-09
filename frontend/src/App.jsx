// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import elisaLogo from './assets/logowebelisa.svg';
import './App.css';
import { Login } from './pages/loginview/login';
import { Register } from './pages/registerview/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

const HomePage = () => (
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
          <li><Link to="/login">Iniciar Sesión</Link></li>
          <li><Link to="/register">Registrarse</Link></li>
        </ul>
      </nav>
    </header>
  </>
);

export default App;
