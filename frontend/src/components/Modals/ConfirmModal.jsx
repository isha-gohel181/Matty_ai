const ConfirmModal = ({ isOpen, onClose, onConfirm, message, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-xl p-6 w-96 shadow-lg flex flex-col gap-4`}
      >
        <h3
          className={`text-lg font-bold ${
            theme === "dark" ? "text-green-400" : "text-green-700"
          }`}
        >
          Confirm Action
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {message}
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl border transition ${
              theme === "dark"
                ? "border-green-600 text-green-400 hover:bg-green-800/30"
                : "border-green-400 text-green-700 hover:bg-green-100"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl transition ${
              theme === "dark"
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
