// App.js
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import elisaLogo from './assets/logowebelisa.svg';
import './App.css';
import { Login } from './pages/loginview/login';
import { Register } from './pages/registerview/register';
import { LoggedView } from './pages/loggedview/loggedview'; 
import { PrivateRoute } from './PrivateRoute';
import { useState } from 'react'; // Add this import

import '../src/pages/loggedview/modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <section className="modal-overlay">
      <article className="modal-content">
        <button onClick={onClose}>Cerrar</button>
        {children}
      </article>
    </section>
  );
};

function App() {
  // Logica para abrir una ventana e iniciar sesión

  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica si hay un token de acceso
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />} >
          <Route path="/home" element={<LoggedView />} />
        </Route>
      </Routes>
    </Router>
  );
}

const HomePage = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

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
            <li onClick={() => setLoginModalOpen(true)}>Iniciar Sesión</li>
            <li onClick={() => setRegisterModalOpen(true)}>Registrarse</li>
          </ul>
        </nav>
      </header>

      <article>
        <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
          <Login />
        </Modal>
        <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
          <Register />
        </Modal>
      </article>
    </>
  );
};

export default App;
