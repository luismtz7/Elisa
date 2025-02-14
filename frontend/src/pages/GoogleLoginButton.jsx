// src/GoogleLoginButton.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        try {
            const { credential } = response;
            const res = await fetch('http://127.0.0.1:8000/accounts/google/login/', {
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
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
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