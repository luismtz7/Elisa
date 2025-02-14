import React, { useState } from 'react';
import axios from 'axios';

const UploadWorkImage = ({ onImageUpload }) => {
    const [file, setFile] = useState(null);
    const [manicuristaId, setManicuristaId] = useState(7); // Cambia esto según la maicurista, pendiente de cambiar para proximo desarrollo 
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imagen', file);
        formData.append('manicurista', manicuristaId);
        formData.append('descripcion', descripcion);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/Works/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Imagen subida:', response.data);

            // Llama a la función onImageUpload para pasar la nueva imagen al componente padre
            onImageUpload(response.data);
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <button type="submit">Subir Imagen</button>
        </form>
    );
};

export { UploadWorkImage};