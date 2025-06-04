"use client";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FiltrosHost from "../components/FiltrosHost";
import Paginacion from "../components/Paginacion";
import { useAuth } from "../lib/authContext";
import { fetchMyCars, updateCarAvailability, deleteCar } from "../lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

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
  isAvailable: boolean | string;
  unavailableDates: string[];
  extraEquipment: string[];
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

export default function MyCars() {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const { token, role, logout } = useAuth();
  const [carsResponse, setCarsResponse] = useState<CarsResponse>({
    cars: [],
    totalCars: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    carType: "",
    transmission: "",
    availability: "",
    sortBy: "",
    page: 1,
    limit: 4,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenCalendar = (car: Car) => {
    setSelectedCarId(car.id);
    const dates = car.unavailableDates.map((date) => new Date(date));
    setUnavailableDates(dates);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const newDates = unavailableDates.includes(date)
      ? unavailableDates.filter((d) => d.getTime() !== date.getTime())
      : [...unavailableDates, date];
    setUnavailableDates(newDates);
  };

  const handleSaveAvailability = async () => {
    if (!selectedCarId || !token) return;

    try {
      const formattedDates = unavailableDates.map(
        (date) => date.toISOString().split("T")[0]
      );
      await updateCarAvailability(selectedCarId, formattedDates, token);
      setCarsResponse((prev) => ({
        ...prev,
        cars: prev.cars.map((car) =>
          car.id === selectedCarId
            ? { ...car, unavailableDates: formattedDates }
            : car
        ),
      }));
      setSelectedCarId(null);
      setUnavailableDates([]);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Error al actualizar la disponibilidad"
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carToDelete) return;

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          if (document.activeElement === cancelButtonRef.current) {
            confirmButtonRef.current?.focus();
          } else {
            cancelButtonRef.current?.focus();
          }
        } else {
          if (document.activeElement === confirmButtonRef.current) {
            cancelButtonRef.current?.focus();
          } else {
            confirmButtonRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [carToDelete]);

  // funcion para que verifique los fltors activos
  const hayFiltrosActivos = () => {
    return (
      filters.brand !== "" ||
      filters.carType !== "" ||
      filters.transmission !== "" ||
      filters.sortBy !== "" ||
      filters.model !== ""
    );
  };

  // función para eliminar un auto
  const handleDeleteCar = async (carId: number) => {
    if (!token) return;

    try {
      await deleteCar(carId, token);
      setCarsResponse((prev) => ({
        ...prev,
        cars: prev.cars.filter((car) => car.id !== carId),
        totalCars: prev.totalCars - 1,
      }));
      toast.success("Auto eliminado exitosamente!!");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Error al eliminar el auto";
      setError(msg);
      toast.error(msg);
    }
  };

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setError("Error al filtrar. Intenta de nuevo");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setIsOnline(false);
      setError("Error al filtrar. Intenta de nuevo");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!token || role !== "host" || !isOnline) return;

    const loadCars = async () => {
      try {
        const response = await fetchMyCars(filters, token);
        setCarsResponse(response);
        setError("");
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar los autos");
      }
    };

    loadCars();
  }, [filters, token, role, isOnline]);

  if (!token || role !== "host") {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
        <Link href="/login">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Iniciar Sesión
          </button>
        </Link>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            icon: null,
            style: {
              background: "#FED7AA",
              color: "#374151",
            },
          },
          error: {
            icon: null,
            style: {
              background: "#FECACA",
              color: "#374151",
            },
          },
        }}
      />
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold">Mis Autos</h1>
        <div className="flex gap-4">
          <Link href="/add-car">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Agregar nuevo Auto
            </button>
          </Link>
        </div>
      </div>
      <p className="text-orange-500 font-semibold text-lg mb-4">
        {carsResponse.totalCars} autos registrados
      </p>
      {/* Filtros de Autos */}
      <FiltrosHost
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={() =>
          setFilters((prev) => ({
            ...prev,
            brand: "",
            model: "",
            carType: "",
            transmission: "",
            availability: "",
            sortBy: "",
            page: 1,
          }))
        }
      />
      {/* Lista de Autos */}
      {carsResponse.cars.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-xl">
          No se encontró autos que coincidan <br />
          con estos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {carsResponse.cars.map((car) => (
            <div
              key={car.id}
              className="border rounded-lg shadow-md p-4 bg-white flex items-center gap-4"
            >
              {/* Imagen a la izquierda */}
              <div className="w-1/3">
                <p className="bg-gray-100 text-center text-sm mt-1 mb-3 py-1 rounded font-semibold">
                  ${car.pricePerDay} / día
                </p>

                <img
                  src={
                    Array.isArray(car.imageUrl)
                      ? car.imageUrl[0]
                      : typeof car.imageUrl === "string"
                      ? car.imageUrl.split(",")[0]?.trim()
                      : ""
                  }
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "";
                  }}
                />

                <p
                  className={`text-sm font-medium mt-2 ${
                    car.isAvailable === true || car.isAvailable === "true" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {car.isAvailable === true || car.isAvailable === "disponible" 
                    ? "🟢 Disponible"
                    : "🔴 No disponible"}
                </p>
              </div>

              {/* Información a la derecha */}
              <div className="w-2/3">
                <h2 className="text-lg font-semibold mb-1">
                  {car.brand} {car.model}
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Año: {car.year}</p>
                  <p>{car.seats} plazas</p>
                  <p>Transmisión: {car.transmission}</p>
                  <p>Categoría: {car.category}</p>
                  <p>Color: {car.color}</p>
                </div>
                {/* {car.extraEquipment.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Equipamiento: {car.extraEquipment.join(", ")}
                  </p>
                )} */}

                {/* Acciones */}
                <div className="flex gap-6 mt-4 text-sm text-center">
                  {/* Info */}
                  <div className="flex flex-col items-center">
                    <Link href={`/car-details-host/${car.id}`}>
                      <button className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600">
                        <FaEye />
                      </button>
                    </Link>
                    <span className="text-gray-700 mt-1">Info</span>
                  </div>

                  {/* Editar */}
                  <div className="flex flex-col items-center">
                    <Link href={`/edit-car/${car.id}`}>
                      <button className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 ml-5">
                        <FaEdit />
                      </button>
                    </Link>
                    <span className="text-gray-700 mt-1 ml-5">Editar</span>
                  </div>

                  {/* Eliminar */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCarToDelete(car)}
                      className="bg-orange-500 text-white p-3 rounded-full hover:bg-red-600 ml-5"
                    >
                      <FaTrash />
                    </button>
                    <span className="text-gray-700 mt-1 ml-5">Eliminar</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal para el Calendario (HU 7) */}
      {selectedCarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Seleccionar Fechas de No Disponibilidad
            </h2>
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              inline
              highlightDates={unavailableDates}
              dateFormat="yyyy-MM-dd"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSaveAvailability}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setSelectedCarId(null);
                  setUnavailableDates([]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>

              <button
                type="button"
                className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                Calendario
              </button>
            </div>
          </div>
        </div>
      )}
      {/* mensaje de confirmación */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setCarToDelete(null)}
          ></div>

          {/* Modal */}
          <div className="relative bg-orange-300 border border-orange-500 text-gray-800 shadow-xl px-6 py-5 rounded-xl w-[90%] max-w-md z-50">
            <p className="text-md font-medium mb-4 text-center">
              {`${carToDelete.brand} ${carToDelete.model} ${carToDelete.year}, ¿Estás seguro de que deseas eliminar este auto? Esta acción no se puede deshacer.`}
            </p>
            <div className="flex justify-center gap-6">
              <button
                ref={cancelButtonRef}
                onClick={() => setCarToDelete(null)}
                className="bg-white text-orange-600 px-4 py-2 rounded-full border border-orange-400 hover:bg-orange-100 transition
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                cancelar
              </button>
              <button
                ref={confirmButtonRef}
                onClick={async () => {
                  await handleDeleteCar(carToDelete.id);
                  setCarToDelete(null);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <Paginacion
        currentPage={carsResponse.currentPage}
        totalPages={carsResponse.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
