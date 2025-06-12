interface NoResultModal{
    onClose: () => void;
  }
  
  export default function NoResultsModal({ onClose }: NoResultModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-[#F9A23E] rounded-xl p-6 w-80 shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-white font-bold text-lg"
          >
            ×
          </button>
          <p className="text-center text-gray-800 font-semibold mb-4">
            No se encontraron autos disponibles con esas características
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-white px-6 py-2 rounded-full text-[#F9A23E] font-semibold hover:bg-gray-100"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  }
  