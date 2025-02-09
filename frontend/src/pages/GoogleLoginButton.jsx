// src/components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        try {
            const { credential } = response;
            // Envía el token al backend para autenticar al usuario
            const res = await fetch('http://localhost:8000/accounts/google/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credential }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                navigate('/'); // Redirige al usuario a la página principal
            } else {
                alert('Error al iniciar sesión con Google');
            }
        } catch (error) {
            console.error(error);
            alert('Error al iniciar sesión con Google');
        }
    };

    const handleError = () => {
        console.log('Error en el inicio de sesión con Google');
    };

    return (
        <GoogleOAuthProvider clientId="1035270722668-jm4gc2rialh902q68gloqgclklmneo24.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;