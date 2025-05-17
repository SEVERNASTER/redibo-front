"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../lib/authContext';
import { DateRange } from 'react-date-range'; // Importar el componente de calendario
import 'react-date-range/dist/styles.css'; // Estilos por defecto
import 'react-date-range/dist/theme/default.css'; // Tema por defecto

export default function AddCar() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [formData, setFormData] = useState({
    location: "",
    brand: "",
    model: "",
    year: "",
    carType: "",
    color: "",
    pricePerDay: "",
    kilometers: "",
    licensePlate: "",
    transmission: "",
    fuelType: "",
    seats: "",
    description: "",
    photoUrls: ["", "", ""],
    extraEquipment: [] as string[],
  });

  const [equipmentInput, setEquipmentInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Estado para el calendario
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [imageErrors, setImageErrors] = useState<string[]>(["", "", ""]);
  const extensionesValidas = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;

   const handlePhotoUrlChange = (index: number, value: string) => {
    const updatedUrls = [...formData.photoUrls];
    const updatedErrors = [...imageErrors];

    if (value.trim() === "") {
      updatedUrls[index] = "";
      updatedErrors[index] = "";
      setFormData({ ...formData, photoUrls: updatedUrls });
      setImageErrors(updatedErrors);
      return;
    }

   if (!extensionesValidas.test(value)) {
      updatedErrors[index] = `La URL ${index + 1} no tiene un formato válido de imagen.`;
      setImageErrors(updatedErrors);
      return;
    }

    const img = new Image();
     img.onload = () => {
     updatedUrls[index] = value;
     updatedErrors[index] = "";
     setFormData({ ...formData, photoUrls: updatedUrls });
     setImageErrors(updatedErrors);
    };
     img.onerror = () => {
     updatedErrors[index] = `La URL ${index + 1} no carga una imagen válida.`;
     setImageErrors(updatedErrors);
    };

     img.src = value;
    };

    const handleAddEquipment = () => {
      if (equipmentInput.trim()) {
        setFormData((prev) => ({
          ...prev,
          extraEquipment: [...prev.extraEquipment, equipmentInput.trim()],
        }));
       setEquipmentInput("");
      }
    };

  const placa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "licensePlate") {
      const raw = value.replace(/[^a-zA-Z0-9]/g, '');
      let formatted = raw;
      if (raw.length > 4) {
        formatted = raw.slice(0, 4) + '-' + raw.slice(4, 7);
      }
      if (formatted.length > 8) return;
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatted.toUpperCase(),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [brandError, setBrandError] = useState('');
  const [modelError, setModelError] = useState('');
  const [kilometersError, setKilometersError] = useState('');
  const [plateError, setPlateError] = useState('');
  const [transmissionError, setTransmissionError] = useState('');
  const [fuelTypeError, setFuelTypeError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [carTypeError, setCarTypeError] = useState<string>('');
  const [locationError, setLocationError] = useState('');
  const [yearError, setYearError] = useState('');
  const [colorError, setColorError] = useState<string>('');
  const [seatsError, setSeatsError] = useState('');
  const [priceError, setPriceError] = useState('');

  const validarCamposObligatorios = () => {
    let errores = false;

    if (!formData.carType) {
      setCarTypeError('El tipo de auto es obligatorio');
      errores = true;
    } else {
      setCarTypeError('');
    }
    if (!formData.location) {
      setLocationError('La ubicación es obligatoria');
      errores = true;
    } else {
      setLocationError('');
    }
    if (!formData.brand) {
      setBrandError('La marca es obligatoria');
      errores = true;
    } else {
      setBrandError('');
    }
    if (!formData.model) {
      setModelError('El modelo es obligatorio');
      errores = true;
    } else {
      setModelError('');
    }
    if (!formData.year) {
      setYearError('El año es obligatorio');
      errores = true;
    } else {
      setYearError('');
    }
    if (!formData.color || colorError) {
      setColorError('El color es obligatorio');
      errores = true;
    } else {
      setColorError('');
    }
    if (!formData.pricePerDay) {
      setPriceError('La tarifa por día es obligatoria');
      errores = true;
    } else {
      setPriceError('');
    }
    if (!formData.seats) {
      setSeatsError('La capacidad es obligatoria');
      errores = true;
    } else {
      setSeatsError('');
    }
    if (!formData.transmission) {
      setTransmissionError('La transmisión es obligatoria');
      errores = true;
    } else {
      setTransmissionError('');
    }
    if (!formData.fuelType) {
      setFuelTypeError('El tipo de combustible es obligatorio');
      errores = true;
    } else {
      setFuelTypeError('');
    }
    if (!formData.kilometers || parseInt(formData.kilometers.toString()) <= 0) {
      setKilometersError('Kilometraje inválido');
      errores = true;
    } else {
      setKilometersError('');
    }
    if (!formData.licensePlate) {
      setPlateError('La placa es obligatoria');
      errores = true;
    } else {
      setPlateError('');
    }
    const validPhotos = formData.photoUrls.filter((url) => url.trim() !== '');
    if (validPhotos.length < 3) {
      setPhotoError('Debes proporcionar al menos 3 URLs de fotos');
      errores = true;
    } else {
      setPhotoError('');
    }
    return !errores;
  };

  const validacionAño = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 4) return;
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    if (!isNaN(year)) {
      if (year < 1900) {
        setYearError('El año no puede ser menor a 1900');
      } else if (year > currentYear) {
        setYearError(`El año no puede ser mayor a ${currentYear}`);
      } else {
        setYearError('');
      }
    } else {
      setYearError('Ingresa un año válido');
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const controlarColor = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const soloLetras = /^[a-zA-Z]*$/;
    if (!soloLetras.test(value)) {
      setColorError('El color solo puede contener letras sin espacios ni caracteres especiales');
      return;
    } else if (value.length > 10) {
      setColorError('El color no puede tener más de 10 caracteres');
      return;
    } else {
      setColorError('');
    }
    setFormData({ ...formData, [name]: value });
  };

  const limiteAsientos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = parseInt(value);
    if (!isNaN(number)) {
      if (number > 20) {
        setSeatsError('La capacidad máxima es 20');
        return;
      } else {
        setSeatsError('');
      }
    } else {
      setSeatsError('Ingrese un número válido');
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validarCaracteres = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validaTarifa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setFormData({ ...formData, pricePerDay: value });
      setPriceError('');
    } else {
      setPriceError('Solo se permiten hasta 3 dígitos positivos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const camposValidos = validarCamposObligatorios();
    if (!camposValidos) {
      return;
    }
    if (!token) {
      setError("Debes iniciar sesión para añadir un auto");
      return;
    }
    if (formData.photoUrls.filter((url) => url.trim() !== "").length < 3) {
      setError("Debes proporcionar al menos 3 URLs de fotos");
      return;
    }
    try {
      const yearGreaterThan = parseInt(formData.year) > new Date().getFullYear();
      const yearLessThan = parseInt(formData.year) < 1900;
      if (yearGreaterThan) {
        toast.error('El año no puede ser mayor al actual');
        throw new Error('El año no puede ser mayor al actual');
      }
      if (yearLessThan) {
        toast.error('El año no puede ser menor a 1900');
        throw new Error('El año no puede ser menor a 1900');
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al añadir el auto");
      }
      toast.success("¡Se guardó correctamente!");
      router.push("/my-cars");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Función para guardar la disponibilidad
  const handleSaveAvailability = async () => {
    if (!availabilityStatus) {
      toast.error("Por favor selecciona si el vehículo está disponible o no");
      return;
    }
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: dateRange[0].startDate,
          endDate: dateRange[0].endDate,
          status: availabilityStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar disponibilidad");
      }
      toast.success("Disponibilidad actualizada exitosamente");
      setIsCalendarOpen(false);
    } catch (err: any) {
      if (err.message.includes("reservas activas")) {
        toast.error("No puedes modificar estas fechas porque tienen reservas activas");
      } else {
        toast.error("Error al actualizar, intenta de nuevo");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        id="formulario"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Información</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Ubicación <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <select
              name="location"
              value={formData.location}
              onChange={validarCaracteres}
              className={`border p-3 rounded w-full ${locationError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona una ubicación</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="La Paz">La Paz</option>
            </select>
            {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Marca <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="text"
                name="brand"
                placeholder="Marca"
                value={formData.brand}
                onChange={(e) => {
                  const onlyLetters = /^[a-zA-Z\s]*$/;
                  const value = e.target.value;
                  if (onlyLetters.test(value) && value.length <= 20) {
                    setFormData({ ...formData, brand: value });
                  }
                }}
                className={`mt-1 block w-full p-2 border rounded ${brandError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {brandError && <p className="text-red-500 text-sm mt-1">{brandError}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Modelo <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="text"
                name="model"
                placeholder="Modelo"
                value={formData.model}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 30) {
                    setFormData({ ...formData, model: value });
                  }
                }}
                maxLength={30}
                className={`mt-1 block w-full p-2 border rounded ${modelError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {modelError && <p className="text-red-500 text-sm mt-1">{modelError}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tipo de Auto <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <select
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${carTypeError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Sedan">Sedán</option>
              <option value="Camioneta">Camioneta</option>
              <option value="SUV">SUV</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
            {carTypeError && <p className="text-red-500 text-sm mt-1">{carTypeError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Año <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={validacionAño}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
                min="1900"
                max={new Date().getFullYear()}
              />
              {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Color <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={controlarColor}
                className={`mt-1 block w-full p-2 border rounded ${colorError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {colorError && <p className="text-red-500 text-sm mt-1">{colorError}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tarifa/Día <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <input
              type="number"
              name="pricePerDay"
              placeholder="$15"
              value={formData.pricePerDay}
              onChange={validaTarifa}
              onKeyDown={(e) => {
                const invalidChars = ['-', '+', 'e', '.', ',', 'E'];
                if (invalidChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`border p-3 rounded w-full ${priceError ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
              max="999"
            />
            {priceError && <p className="text-red-500 text-sm mt-1">{priceError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Kilometraje <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="number"
                name="kilometers"
                placeholder="5000 km/h"
                value={formData.kilometers}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border rounded ${kilometersError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {kilometersError && <p className="text-red-500 text-sm mt-1">{kilometersError}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Placa <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
              <input
                type="text"
                name="licensePlate"
                placeholder="0000-AAA"
                value={formData.licensePlate}
                onChange={placa}
                className={`mt-1 block w-full p-2 border rounded ${plateError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {plateError && <p className="text-red-500 text-sm mt-1">{plateError}</p>}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Equipamiento</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Transmisión <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${transmissionError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>
            {transmissionError && <p className="text-red-500 text-sm mt-1">{transmissionError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Combustible <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${fuelTypeError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Gas">Gas</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
            {fuelTypeError && <p className="text-red-500 text-sm mt-1">{fuelTypeError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Capacidad (asientos) <span className="text-red-500 text-[1.5rem] font-semibold">*</span></label>
            <div className="flex gap-2">
              <input
                type="text"
                name="seats"
                value={formData.seats}
                onChange={limiteAsientos}
                className={`border p-3 rounded w-full ${seatsError ? 'border-red-500' : 'border-gray-300'}`}
                max="20"
              />
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="border border-black-500 text-black-500 px-8 py-2 rounded mt-2 ml-[-50]"
              >
                Calendario
              </button>
            </div>
            {seatsError && <p className="text-red-500 text-sm mt-1">{seatsError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-3 rounded w-full h-32"
            />
          </div>
        </div>

        <div className="md:col-span-1">
         <h2 className="text-xl font-bold mb-4 uppercase">
          Fotos (URL) <span className="text-red-500 text-[1.5rem] font-semibold">*</span>
         </h2>

        {formData.photoUrls.map((url, idx) => (
         <div className="mb-4" key={idx}>
          <input
           type="text"
           value={url}
           onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
           placeholder={`URL de la foto ${idx + 1}`}
           className={`mt-1 block w-full p-2 border rounded ${
           imageErrors[idx] ? "border-red-500" : "border-gray-300"
           }`}
          />
         {imageErrors[idx] && (
           <p className="text-red-500 text-sm mt-1">{imageErrors[idx]}</p>
         )}
         {extensionesValidas.test(url) &&
           url.trim() !== "" &&
           !imageErrors[idx] && (
             <img
              src={url}
              alt={`Foto ${idx + 1}`}
              className="w-32 h-auto mt-2 border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
             />
          )}
         </div>
       ))}

      {formData.photoUrls.length < 5 && (
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
             ...prev,
             photoUrls: [...prev.photoUrls, ""],
           }))
         }
          className="text-orange-500"
        >
            + Agregar otra foto
         </button>
         )}
       </div>      
    </form>

      {/* Modal del calendario */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <DateRange
              editableDateInputs={true}
              onChange={(item: any) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              months={2}
              direction="horizontal"
              rangeColors={['#3b82f6']}
            />
            <div className="mt-4">
              <label className="block text-gray-600 mb-2">¿El vehículo está disponible?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAvailabilityStatus('available')}
                  className={`px-4 py-2 rounded ${availabilityStatus === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityStatus('unavailable')}
                  className={`px-4 py-2 rounded ${availabilityStatus === 'unavailable' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  No
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="border border-orange-500 text-orange-500 px-8 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAvailability}
                className="bg-orange-500 text-white px-8 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="border border-orange-500 text-orange-500 px-8 py-2 rounded"
          onClick={() => router.push("/my-cars")}
        >
          Cancelar
        </button>
        <button
          form="formulario"
          type="submit"
          className="bg-orange-500 text-white px-8 py-2 rounded"
        >
          Guardar
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}