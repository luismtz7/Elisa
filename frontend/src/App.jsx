// App.js
import { BrowserRouter as Router, Route, Routes, Link, Navigate, Outlet } from 'react-router-dom';
import elisaLogo from './assets/logowebelisa.svg';
import './App.css';
import { Login } from './pages/loginview/login';
import { Register } from './pages/registerview/register';
import { LoggedView } from './pages/loggedview/loggedview'; 
import { PrivateRoute } from './PrivateRoute';
import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { Gallery } from './pages/galleryview/gallery';
import { Calendar } from './pages/calendarview/calendar';
import { jwtDecode } from 'jwt-decode';

import '../src/pages/loggedview/modal.css';
import { use } from 'react';

function App() {

  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica si hay un token de acceso
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />}>
          <Route path='/gallery' element={<Gallery />}/>
          <Route path='/agendar-cita' element={<Calendar />}/>
        </Route>
        <Route element={<PrivateRoute />} >
          <Route path="/home" element={<LoggedView />} />
        </Route>
      </Routes>
    </Router>
  );
}

const HomePage = ({ isAuthenticated }) => {
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

    
    const accessToken = localStorage.getItem('access_token');// Obtiene el token de acceso
    let decodedToken = null;
    let userRole = '';

      if (accessToken) {
        try {
          decodedToken = jwtDecode(accessToken);
          userRole = decodedToken.rol || '';
        } catch (error) {
          console.error('Error decoding token:', error);
          // Handle the error, e.g., redirect to login or show a message
        }
      }

  return (
    <>
      <header>
        <img className='elisalogo' src={elisaLogo} alt="Elisa Logo" />
        <h1 className='elisatitle'>ELISA</h1>
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/gallery">Galeria</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            
            {userRole === 'manicurista' && (
                <li><Link to="/agendar-cita">Citas</Link></li>
            )}

            {userRole === 'cliente' && (
              <li><Link to="/agendar-cita">Agendar cita</Link></li>
            )}
            
            {!isAuthenticated && (
              <>
                <li onClick={openFirstModal}>Iniciar Sesión</li>
                <li onClick={openSecondModal}>Registrarse</li>
              </>
            )}
          </ul>
          
          {isAuthenticated && <LoggedView />}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>  

      <Login
        isOpen={activeModal === "login"}
        onClose={closeModal}
        onOpenSecondModal={openSecondModal} />
      <Register 
        isOpen={activeModal === "register"}
        onClose={closeModal}
        onOpenFirstModal={openFirstModal} />
    </>
  );
};

export default App;
