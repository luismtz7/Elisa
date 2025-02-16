import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import './register.css';
import '../loggedview/modal.css';

export const Register = ({ isOpen, onClose, onOpenFirstModal }) => {
    // Hooks llamados incondicionalmente
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rol: 'cliente',
        telefono: '',
    });

    // Condición después de los hooks
    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            alert(response.message);
            onOpenFirstModal();
        } catch (error) {
            alert(error.error || 'Error al registrar el usuario');
        }
    };

    return (
        <>
            <section className='modal-overlay' onClick={onClose}>
                <article className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose}>Cerrar</button>

                    <h1>Registrarse</h1>
                    <form className='form' onSubmit={handleSubmit}>
                        <article className='flex-column'>
                            <label>Usuario</label>
                        </article>

                        <article className="inputForm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                type="text"
                                className="input"
                                name="username"
                                placeholder="Ingresa tu usuario"
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <article className='flex-column'>
                            <label>Correo electrónico</label>
                        </article>

                        <article className="inputForm">
                            <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
                                <g id="Layer_3" data-name="Layer 3">
                                    <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                                </g>
                            </svg>
                            <input
                                type="email"
                                className="input"
                                name="email"
                                placeholder="Ingresa tu correo electrónico"
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <article className='flex-column'>
                            <label>Contraseña</label>
                        </article>

                        <article className="inputForm">
                            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
                                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                            </svg>
                            <input
                                type="password"
                                className="input"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <article className='flex-column'>
                            <label>Teléfono</label>
                        </article>

                        <article className="inputForm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <input
                                type="text"
                                className="input"
                                name="telefono"
                                placeholder="Ingresa tu teléfono"
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <button type="submit" className="button-submit">Registrarse</button>

                        <p className="p">
                            ¿Ya tienes una cuenta?
                            <span className="span" onClick={onOpenFirstModal}> Inicia sesión</span>
                        </p>
                    </form>
                </article>
            </section>
        </>
    );
};