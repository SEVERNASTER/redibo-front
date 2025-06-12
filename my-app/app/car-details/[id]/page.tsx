'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCarById } from '../../lib/api';
import { useAuth } from '../../lib/authContext';
import { useRouter } from 'next/navigation';


interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  color: string;
  imageUrl: string;
  isAvailable: boolean;
  unavailableDates: string[];
  extraEquipment: string[];
  rentalCount: number;
  location: string;
  kilometers: string;
  licensePlate: string;
  fuelType: string;
  description?: string;
}


export default function CarDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCar = async () => {
      if (!token) return;
      try {
        const response = await fetchCarById(Number(id), token);
        setCar(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los detalles del auto');
      }
    };

    loadCar();
  }, [id, token]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!car) return <p className="text-center">Cargando...</p>;

  const imageArray =
    Array.isArray(car.imageUrl)
      ? car.imageUrl
      : typeof car.imageUrl === 'string'
        ? car.imageUrl.split(',').map((url) => url.trim()).filter((url) => url !== '')
        : [];

  console.log('car.imageUrl:', car.imageUrl);
  console.log('imageArray:', imageArray);

  return (

    <div className="max-w-5xl mx-auto p-4 flex flex-col items-center gap-6">

      {/* Imágenes */}
      <div className="w-full grid grid-cols-3 gap-4">

        {/* Imagen principal */}
        <div className="col-span-2">
          <img
            src={imageArray[0]} 
            alt="Imagen principal"
            onClick={() => setZoomImage(imageArray[0])} 
            className="w-full h-[320px] object-cover rounded-xl shadow"
          />
        </div>

        {/* Miniaturas */}
        <div className="flex flex-col gap-4">
          {imageArray[1] && (
            <img
              src={imageArray[1]}
              alt="Vista 2"
              onClick={() => setZoomImage(imageArray[1])} 
              className="w-full h-[150px] object-cover rounded-xl shadow"
            />
          )}
          {imageArray[2] && (
            <div className="relative">
              <img
                src={imageArray[2]}
                alt="Vista 3"
                className="w-full h-[150px] object-cover rounded-xl shadow"
              />

              {imageArray.length > 3 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-3 py-1 text-sm rounded shadow flex items-center gap-2 hover:bg-opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A1 1 0 0120 13.118V17a1 1 0 01-1 1h-6v-4a1 1 0 00-1-1H5a1 1 0 00-1 1v4H3a1 1 0 01-1-1v-3.882a1 1 0 01.447-.842L7 10" />
                  </svg>
                  ver {imageArray.length - 3} fotos
                </button>
              )}

              {/*Mostrar galeria de fotos*/}

              {showModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 max-w-4xl w-full relative">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-xl"
                    >
                      x
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Galería de fotos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageArray.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                          onClick={() => setZoomImage(url)}
                        />
                      ))}
                    </div>
                  </div>

                  {zoomImage && (
                    <div className="fixed inset-0 z-60 bg-black bg-opacity-80 flex items-center justify-center">
                      <div className="relative max-w-3xl w-full p-4">
                        <button
                          onClick={() => setZoomImage(null)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/70 rounded-md flex items-center justify-center text-black text-2xl hover:bg-white hover:text-red-500 transition-all duration-300 shadow-md"
                        >
                          x
                        </button>
                        <img
                          src={zoomImage}
                          alt="Imagen ampliada"
                          className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          )}

        </div>
      </div>

      <div className="flex justify-between items-start mt-6">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">
            {car.brand} {car.model} {car.year}
          </h1>

          {/* Rating y viajes */}
          <div className="flex items-center text-black-500">
            <span className="text-lg font-semibold mr-1">4.99</span>
            <span>⭐</span>
            <span className="ml-2 text-gray-600 text-sm">({car.rentalCount} viajes)</span>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">🔧 {car.transmission}</span>
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">📍 {car.kilometers}</span>
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">{car.fuelType}</span>
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">{car.category}</span>
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">{car.seats} asientos</span>
            <span className="px-4 py-2 rounded-full bg-orange-100 text-black-700 text-sm">{car.licensePlate}</span>
          </div>

          {/* Descripción */}

          <div>
            <h1 className="text-xl font-semibold mb-2">Descripción</h1>
            <p className="text-gray-700 leading-relaxed text-justify">
              {car.description || 'Este auto no tiene una descripción disponible.'}
            </p>
          </div>
        </div>

        {/* Precio */}
        <div>
          <span className="bg-orange-100 text-green-700 font-semibold px-4 py-2 rounded text-lg">
            ${car.pricePerDay}/día
          </span>
        </div>
      </div>
      
        {/*Boton para volver a la lista de autos*/}
          <button
            onClick={() => router.push('/search')} 
            className="mt-4 px-6 py-2 rounded-full shadow-md bg-white text-black hover:bg-orange-500 hover:text-white hover:shadow-lg active:scale-95 transition-all duration-300"
           >
             Volver a la lista
          </button>

      </div>
  );
}
