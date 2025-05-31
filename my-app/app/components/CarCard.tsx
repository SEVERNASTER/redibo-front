'use Client';
import Link from 'next/link';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  discount: number;
  rentalCount: number;
  rating: number;
  location: {
    idUbicacion: number;
    nombre: string;
    departamento: string;
    descripcion?: string;
    latitud: number;
    longitud: number;
    esActiva: boolean;
  }
  imageUrl: string[] | string; 
  host: {
    id: number;
    email: string;
  };
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const imageArray = Array.isArray(car.imageUrl)
  ? car.imageUrl
  : typeof car.imageUrl === 'string'
  ? car.imageUrl.split(',').map((url) => url.trim()).filter((url) => url !== '')
  : [];

console.log("Primera imagen:", Array.isArray(car.imageUrl) ? car.imageUrl[0] : car.imageUrl);

return (
  <Link href={`/car-details/${car.id}`}>
    <div className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
      <div className="w-full h-36 overflow-hidden rounded">
        <img
          src={imageArray[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />
     </div>
     
        <div className="px-2">
          <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
          <p className="text-sm text-gray-600">Cant de rentas: {car.rentalCount}</p>
          <p className="text-sm text-gray-600">{car.location?.nombre}, {car.location?.departamento}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-lg font-bold text-black">{car.pricePerDay}$</span>
            <div className="flex items-center text-sm text-yellow-500">
              ★ <span className="text-black ml-1">{car.rating}</span>
            </div>
          </div>
          {car.discount > 0 && (
            <p className="text-green-500">%{car.discount} descuento</p>
          )}
        </div>
      </div>
    </Link>
  );
}