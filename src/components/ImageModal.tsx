
interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="neo-card p-4 max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Task Image</h3>
          <button
            onClick={onClose}
            className="neo-button bg-red-500 text-white"
          >
            ✕ Close
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Task"
          className="w-full h-auto border-4 border-black"
        />
      </div>
    </div>
  );
};
