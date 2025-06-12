"use client";
import React from "react";

interface PanelProps {
  visible: boolean;
  onClose: () => void;
  filters: FiltersProps["filters"]; // Importa esto si es necesario
  onFilterChange: (filters: FiltersProps["filters"]) => void;
}

interface FiltersProps {
  filters: {
    location?: string;
    startDate?: string;
    rating: number;
    endDate?: string;
    hostId?: string;
    carType?: string;
    transmission?: string;
    consumo?: string;
    fuelType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;

    // Agregados para el panel
    capacidad?: string;
    color?: string;
    kilometrajes?: string;
  };
  onFilterChange: (filters: FiltersProps["filters"]) => void;
}

const Panel: React.FC<PanelProps> = ({ visible, onClose, filters, onFilterChange }) => {
  if (!visible) return null;

  return (
    <div
        className="fixed top-[180px] left-[40px] bg-white border rounded-lg shadow-xl z-50 w-64 max-h-[400px] overflow-y-auto p-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
        <style jsx>{`
            div::-webkit-scrollbar {
                display: none;
            }
        `}</style>

      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">Más filtros</h4>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          ×
        </button>
      </div>

      {/* Capacidad */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Capacidad</p>
        {["1 a 2 personas", "3 a 5 personas", "6 o más"].map((capacidad) => (
          <label key={capacidad} className="flex items-center gap-2">
            <input
                type="checkbox"
                name="capacidad"
                value={capacidad.toLowerCase()}
                checked={filters.capacidad === capacidad.toLowerCase()}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    capacidad:
                      filters.capacidad === capacidad.toLowerCase()
                        ? undefined
                        : capacidad.toLowerCase(),
                  })
                }
                className="appearance-none w-4 h-4 border border-gray-400 rounded-md checked:bg-white checked:border-orange-500 checked:before:content-['✔'] checked:before:text-orange-500 checked:before:text-xs checked:before:block checked:before:text-center"
                />
            {capacidad}
          </label>
        ))}
      </div>

      {/* Colores */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Color auto</p>
        {["Blanco", "Rojo", "Negro", "Gris", "Azul", "Otro"].map((color) => (
          <label key={color} className="flex items-center gap-2">
            <input
                type="checkbox"
                name="color"
                value={color.toLowerCase()}
                checked={filters.color === color.toLowerCase()}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    color:
                      filters.color === color.toLowerCase()
                        ? undefined
                        : color.toLowerCase(),
                  })
                }
                className="appearance-none w-4 h-4 border border-gray-400 rounded-md checked:bg-white checked:border-orange-500 checked:before:content-['✔'] checked:before:text-orange-500 checked:before:text-xs checked:before:block checked:before:text-center"
                />
            {color}
          </label>
        ))}
      </div>

      {/* Kilometraje */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Kilometraje</p>
        {["0 – 10.000 km", "10.000 – 50.000 km", "más de 50.000 km"].map((kilometraje) => (
          <label key={kilometraje} className="flex items-center gap-2">
            <input
                type="checkbox"
                name="kilometrajes"
                value={kilometraje.toLowerCase()}
                checked={filters.kilometrajes === kilometraje.toLowerCase()}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    kilometrajes:
                      filters.kilometrajes === kilometraje.toLowerCase()
                        ? undefined
                        : kilometraje.toLowerCase(),
                  })
                }
                className="appearance-none w-4 h-4 border border-gray-400 rounded-md checked:bg-white checked:border-orange-500 checked:before:content-['✔'] checked:before:text-orange-500 checked:before:text-xs checked:before:block checked:before:text-center"
                />
            {kilometraje}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Panel;
