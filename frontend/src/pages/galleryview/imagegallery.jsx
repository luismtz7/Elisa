import React from 'react';

const ImageGallery = ({ images }) => {
    return (
        <div>
            {images.map((image) => (
                <article key={image.id} style={{ margin: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <img
                        src={image.imagen} // URL de la imagen
                        alt={image.descripcion}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <p>{image.descripcion}</p>
                    <small>Subido el: {new Date(image.fecha_subida).toLocaleDateString()}</small>
                </article>
            ))}
        </div>
    );
};

export { ImageGallery };