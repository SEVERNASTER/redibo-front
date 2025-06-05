"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../lib/authContext";
import Filters from "../components/Filters";
import CarCard from "../components/CarCard";
import { fetchCars } from "../lib/api";
import NoResultModal from "../components/NoResultModal";
import ErrorModal from "../components/ErrorModal";
import Paginacion from "../components/Paginacion";


interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number | string;
  discount: number;
  rentalCount: number;
  rating: number;
  location: {
    departamento: string;
  };
  imageUrl: { direccionImagen: string }[];
  host: {
    id: number;
    email: string;
  };
}


interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

export default function Search() {
  const { token, logout } = useAuth();
  const [carsResponse, setCarsResponse] = useState<CarsResponse>({
    cars: [],
    totalCars: 0,
    currentPage: 1,
    totalPages: 0,
  });

  const [showNoResults, setShowNoResults] = useState(false);

  const [filters, setFilters] = useState<{
    location: string;
    startDate: string;
    endDate: string;
    hostId?: string;
    carType: string;
    transmission: string;
    fuelType: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
    page: number;
    search: string;
    rating: number;
    limit: number;
    capacidad?: string;
    color?: string;
    kilometrajes?: string;
  }>({
    location: "",
    startDate: "",
    endDate: "",
    hostId: undefined,
    carType: "",
    transmission: "",
    fuelType: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "relevance",
    page: 1,
    search: "",
    rating: 0,
    limit: 6,
    capacidad: undefined,
    color: undefined,
    kilometrajes: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  const hayFiltrosEspecificos = () => {
    return (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.rating > 0 ||
      filters.hostId ||
      filters.carType ||
      filters.transmission ||
      filters.fuelType ||
      filters.capacidad ||
      filters.color ||
      filters.kilometrajes
    );
  };

  useEffect(() => {
  const fetchFilteredCars = async () => {
    const adaptedFilters = {
      ...filters,
      hostId: filters.hostId ? parseInt(filters.hostId) : undefined,
    };

    try {
      const response = await fetchCars(adaptedFilters);

      const adaptedCars = response.cars.map((car: any) => ({
        ...car,
        location: { departamento: car.location?.departamento || car.location?.nombre || "Desconocido" },
        imageUrl: Array.isArray(car.imageUrl)
          ? car.imageUrl
          : [{ direccionImagen: car.imageUrl }],
      }));

      setCarsResponse({
        ...response,
        cars: adaptedCars,
      });

      if (adaptedCars.length === 0 && hayFiltrosEspecificos()) {
        setShowNoResults(true);
      } else {
        setShowNoResults(false);
      }
    } catch (err) {
      console.error("Error al filtrar:", err);
      setError("error");
    }
  };

  fetchFilteredCars();
}, [filters]);

  { error && <ErrorModal onClose={() => setError(null)} /> }

  return (
    <div className="container mx-auto p-4">
      {/* Filtros y Búsqueda */}
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {/* Lista de Autos */}
      <div>
        <p className="text-gray-600 mb-4 px-8">
          {carsResponse.totalCars} resultados
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
          {carsResponse.cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>

      {/* Paginación */}
      <Paginacion
        currentPage={carsResponse.currentPage}
        totalPages={carsResponse.totalPages}
        onPageChange={handlePageChange}
      />

      {/* MODAL de no resultados */}
      {showNoResults && (
        <NoResultModal onClose={() => setShowNoResults(false)} />
      )}
    </div>
  );
}
