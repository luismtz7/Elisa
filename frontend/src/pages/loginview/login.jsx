// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import  GoogleLoginButton from '..//GoogleLoginButton'; // Importa el botón de Google
import './login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleBackClick = () => {
        navigate(-1); // Go back
    };

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
            navigate('/Home'); // Redirige al usuario a la página principal después del login
        } catch (error) {
            alert(error.error || 'Error al iniciar sesión');
        }
    };

    return (
        <>  
            <article className='fi' onClick={handleBackClick}>
                <button onClick={handleBackClick}><i className="fi fi-rr-arrow-small-left"></i></button>
            </article>
            <section className='loginbody'>
                <form className="form" onSubmit={handleSubmit}>
                    <article className="flex-column">
                        <label>Correo electrónico o usuario</label>
                    </article>

                    <article className="inputForm">
                        <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
                        <input 
                            type="text" 
                            className="input" 
                            name="username" 
                            placeholder="Ingresa tu correo electrónico o usuario" 
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

                    <p className="p">¿No tienes una cuenta? <span className="span">Registrate</span></p>
                    <p className="p line">Resgistrarse con</p>

                    <article className="flex-row">
                        <GoogleLoginButton />  {/* Botón de Google */}
                    </article>
                </form>
            </section>
        </>
    );
};