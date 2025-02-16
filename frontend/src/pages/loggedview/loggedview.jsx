import React, { useState, useEffect, useRef, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import "./loggedview.css";
import { AuthContext } from '../../authContext/authContext';
import { jwtDecode } from 'jwt-decode';
import "./modal.css"
import { UploadWorkImage } from "./uploadworkimage";
import axios from 'axios';

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

export const LoggedView = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload(); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
  };

  const accessToken = localStorage.getItem('access_token');
  let decodedToken = null;
  let userRole = '';
  let userName = '';

  if (accessToken) {
    try {
      decodedToken = jwtDecode(accessToken);
      userRole = decodedToken.rol || '';
      userName = decodedToken.username;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Handle the error, e.g., redirect to login or show a message
    }
  }

  const [images, setImages] = useState([]);

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

  const handleImageUpload = (newImage) => {
      setImages([...images, newImage]);
  };

  return (
    <>
      <article className="relative" ref={menuRef}>
        <button className="UserIcon" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>

        {/* Menú desplegable */}
        {menuOpen && (
          <article className="userMenu">

            <p>
              {userName}
            </p>

            <article className="item">
              <Link
                to="/perfil"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Mi Perfil
              </Link>
            </article>

            <article className="item">
              <Link
                to="/configuracion"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Configuración
              </Link>
            </article>

            {
              userRole === 'manicurista' && (
                <article className="item">
                    <button onClick={() => setModalOpen(true)}>
                      Subir imagen
                    </button>
                </article>
              )
            }

            <article className="item">
              <button
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </article>
          </article>
        )}
      </article>

      <article>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2>Subir imagenes</h2>
          <UploadWorkImage onImageUpload={handleImageUpload}/>
        </Modal>
      </article>
    </>
  );
};
