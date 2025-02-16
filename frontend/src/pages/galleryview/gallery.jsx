import React from "react";
import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { ImageGallery } from './imagegallery';

function Gallery() {
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

  return (
    <>
      <ImageGallery images={images} />
    </>
  );
}

export { Gallery };