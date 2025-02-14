// App.js
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import elisaLogo from './assets/logowebelisa.svg';
import './App.css';
import { Login } from './pages/loginview/login';
import { Register } from './pages/registerview/register';
import { LoggedView } from './pages/loggedview/loggedview'; 
import { PrivateRoute } from './PrivateRoute';
import { useState, useEffect } from 'react'; // Add this import
import axios from 'axios'; // Add this import
import { ImageGallery } from './pages/galleryview/imagegallery'; // Add this import

import '../src/pages/loggedview/modal.css';

function App() {

  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica si hay un token de acceso
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <HomePage />} />
        {/*
        <Route element={<Login />} />
        <Route element={<Register />} />
        */}
        <Route element={<PrivateRoute />} >
          <Route path="/home" element={<LoggedView />} />
        </Route>
      </Routes>
    </Router>
  );
}

const HomePage = () => {
      // Cargar imágenes al iniciar la aplicación
    useEffect(() => {
      const fetchImages = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/api/Works/');
              setImages(response.data);
          } catch (error) {
              console.error('Error al cargar las imágenes:', error);
          }
      };
        fetchImages();
    }, []);

  const [images, setImages] = useState([]);


    // Logica para abrir una ventana e iniciar sesión
    const [activeModal, setActiveModal] = useState(null); // null, "first", o "second"

    const openFirstModal = () => {
      setActiveModal("login"); // Abre la primera modal
    };
  
    const openSecondModal = () => {
      setActiveModal("register"); // Abre la segunda modal
    };
  
    const closeModal = () => {
      setActiveModal(null); // Cierra todas las modales
    };

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
            <li onClick={openFirstModal}>Iniciar Sesión</li>
            <li onClick={openSecondModal}>Registrarse</li>
          </ul>
        </nav>
      </header>

      <article>
        <Login
        isOpen={activeModal === "login"}
        onClose={closeModal}
        onOpenSecondModal={openSecondModal} />
        <Register 
        isOpen={activeModal === "register"}
        onClose={closeModal}
        onOpenFirstModal={openFirstModal}/>
      </article>

      <ImageGallery images={images} />
    </>
  );
};

export default App;
