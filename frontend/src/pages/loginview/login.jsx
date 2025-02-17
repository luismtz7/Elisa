import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import './login.css';
import '../loggedview/modal.css';

export const Login = ({ isOpen, onClose, onOpenSecondModal }) => {
    // Hooks llamados incondicionalmente
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    // Condición después de los hooks
    if (!isOpen) return null;

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            alert('Inicio de sesión exitoso');
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert(error.error || 'Error al iniciar sesión');
        }
    };

    return (
        <>
            <section className='modal-overlay' onClick={onClose}>
                <article className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose}>Cerrar</button>
                    <h1>Iniciar sesión</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <article className="flex-column">
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
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <article className="flex-column">
                            <label>Contraseña </label>
                        </article>
                        
                        <article className="inputForm">
                            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>        
                            <input 
                                type="password" 
                                className="input" 
                                name="password" 
                                placeholder="Ingresa tu contraseña" 
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </article>

                        <article className="flex-row">
                            <article>
                                <input 
                                    type="checkbox" 
                                    placeholder='recuerdamecheckbox'/>
                                <label>Recuérdame </label>
                            </article>
                            <span className="span">¿Olvidaste la contraseña?</span>
                        </article>

                        <button type="submit" className="button-submit">Iniciar sesión</button>

                        <p className="p">
                        ¿No tienes una cuenta? 
                        <span className="span" onClick={onOpenSecondModal}> Regístrate</span>
                        </p>
                        {/* 
                        <p className="p line">Resgistrarse con</p>

                        
                        <article className="flex-row">
                            <GoogleLoginButton /> 
                        </article>
                        */}
                    </form>
                </article>
            </section>
        </>
    );
};