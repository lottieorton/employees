import Button from "../Button/Button";

interface ModalProps {
  firstName: string;
  lastName: string;
  role: string;
  handleClick: () => void;
  closeModal: () => void;
  actionText: string;
}

export default function Modal({
  firstName,
  lastName,
  role,
  handleClick,
  closeModal,
  actionText,
}: ModalProps) {
  return (
    <section
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      data-testid="outer-section"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Remove employee?
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6 text-gray-600 items-center">
          <p className="w-full">Are you sure you want to delete?</p>
          <div className="flex flex-col w-4/5 bg-gray-100 p-4 rounded">
            <p className="font-bold text-base">{`${firstName} ${lastName}`}</p>
            <p className="text-sm">{`${role}`}</p>
          </div>
          <p className="w-full">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button size="lg" type="secondary" handleClick={closeModal}>
            Cancel
          </Button>
          <Button size="lg" type="danger" handleClick={handleClick}>
            {actionText}
          </Button>
        </div>
      </div>
    </section>
  );
}
