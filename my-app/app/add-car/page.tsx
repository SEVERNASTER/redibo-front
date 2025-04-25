"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../lib/authContext';

export default function AddCar() {

  
  const router = useRouter();
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
  const { token } = useAuth();
  

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUrlChange = (index: number, value: string) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls[index] = value;
    setFormData((prev) => ({ ...prev, photoUrls: newPhotoUrls }));
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
        formatted = raw.slice(0, 4) + '-' + raw.slice(4, 7); // Solo permitimos 3 letras máximo después del guion
      }

      if (formatted.length > 8) return;

      setFormData((prevData) => ({
        ...prevData,
        [name]: formatted.toUpperCase(), // Convierte a mayúsculas automáticamente
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
  
  const handleRemoveEquipment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraEquipment: prev.extraEquipment.filter((_, i) => i !== index),
    }));
  };

  const [yearError, setYearError] = useState('');
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

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };



  const [colorError, setColorError] = useState<string>('');

  const controlarColor = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const soloLetras = /^[a-zA-Z]*$/;

    if (!soloLetras.test(value)) {
      setColorError('El color solo puede contener letras sin espacios ni caracteres especiales');
      return;
    } else if (value.length > 10) {
      setColorError('El color no puede tener más de 15 caracteres');
      return;
    } else {
      setColorError('');
    }

    setFormData({ ...formData, [name]: value });
  };




  const [seatsError, setSeatsError] = useState('');
  const limiteAsientos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;  // Solo números enteros

    const number = parseInt(value);

    if (!isNaN(number)) {
      if (number > 20) {
        setSeatsError('La capacidad máxima es 20');
        return; // No actualizamos el valor en el estado
      } else {
        setSeatsError(''); 
      }
    } else {
      setSeatsError('Ingrese un número válido');
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };


  const [locationError, setLocationError] = useState('');
  const validarCaracteres = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const [priceError, setPriceError] = useState('');
  const validaTarifa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setFormData({
        ...formData,
        pricePerDay: value,
      });
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
        toast.error('El año no puede ser mayor al actual')
        throw new Error('El año no puede ser mayor al actual')
      }

      if (yearLessThan) {
        toast.error('El año no puede ser menor a 1900')
        throw new Error('El año no puede ser menor a 1900')
      }

      const response = await fetch("http://localhost:5000/api/cars", {
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
      toast.success("¡Se guardo correctamente!");
      router.push("/my-cars");
    } catch (err: any) {
      setError(err.message);
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
            <label className="block text-gray-600 mb-1">Ubicación</label>
            <select
              name="location"
              value={formData.location}
              onChange={validarCaracteres}
              className={`border p-3 rounded w-full ${locationError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Selecciona una ubicación</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="La Paz">La Paz</option>
              {/*<option value="Tarija">Tarija</option>
              <option value="Sucre">Sucre</option>
              <option value="Oruro">Oruro</option>
              <option value="Pando">Pando</option>
              <option value="Beni">Beni</option>
              <option value="Potosi">Potosi</option>*/}

            </select>
            {locationError && (
              <p className="text-red-500 text-sm mt-1">{locationError}</p>
            )}
          </div>



          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Marca</label>
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
                
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {brandError && (
              <p className="text-red-500 text-sm mt-1">{brandError}</p>
            )}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Modelo</label>
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
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {modelError && (
              <p className="text-red-500 text-sm mt-1">{modelError}</p>
            )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tipo de Auto</label>
            <select
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Sedan">Sedán</option>
              <option value="Camioneta">Camioneta</option>
              <option value="SUV">SUV</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
            { carTypeError && (
              <p className="text-red-500 text-sm mt-1">{carTypeError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Año</label>
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
                required
                min="1900"
                max={new Date().getFullYear()}
              />
              {yearError && (
                <p className="text-red-500 text-sm mt-1">{yearError}</p>
              )}

            </div>

            <div>
              <label className="block text-gray-600 mb-1">Color</label>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={controlarColor}
                className={`mt-1 block w-full p-2 border rounded ${colorError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {yearError && (
                <p className="text-red-500 text-sm mt-1">{colorError}</p>
              )}
            </div>

          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tarifa/Día</label>
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
              required
              min="0"
              max="999"
            />
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>



          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Kilometraje</label>
              <input
                type="number"
                name="kilometers"
                placeholder="5000 km/h"
                value={formData.kilometers}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              { kilometersError && (
              <p className="text-red-500 text-sm mt-1">{kilometersError}</p>
            )}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Placa</label>
              <input
                type="text"
                name="licensePlate"
                placeholder="0000-AAA"
                value={formData.licensePlate}
                onChange={placa}
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
              />
              { plateError && (
              <p className="text-red-500 text-sm mt-1">{plateError}</p>
            )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Equipamiento</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Transmisión</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>
            { transmissionError && (
              <p className="text-red-500 text-sm mt-1">{transmissionError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Combustible</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Gas">Gas</option>
              <option value="Gasolina">Gasolina</option>
            </select>
            { fuelTypeError && (
              <p className="text-red-500 text-sm mt-1">{fuelTypeError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Capacidad (asientos)</label>
            <input
              type="text" // Cambié de "number" a "text" para controlar la entrada
              name="seats"
              value={formData.seats}
              onChange={limiteAsientos}
              className={`border p-3 rounded w-full ${seatsError ? 'border-red-500' : 'border-gray-300'}`}
              max="20"
              required
            />
            {seatsError && (
              <p className="text-red-500 text-sm mt-1">{seatsError}</p>
            )}
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
          <h2 className="text-xl font-bold mb-4 uppercase">Fotos (URL)</h2>
          {formData.photoUrls.map((url, idx) => (
            <div className="mb-2" key={idx}>
              <input
                type="text"
                value={url}
                onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                placeholder={`URL de la foto ${idx + 1}`}
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
                required={idx < 3}
              />
            </div>
          ))}
          {formData.photoUrls.length < 5 && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, ""] }))
              }
              className="text-orange-500"
            >
              + Agregar otra foto
            </button>
          )}
          { photoError && (
              <p className="text-red-500 text-sm mt-1">{photoError}</p>
            )}
        </div>
      </form>

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
          onClick={handleSubmit}
        >
          Guardar
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
  //hola
}