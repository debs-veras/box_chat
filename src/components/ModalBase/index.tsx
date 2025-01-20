import * as Dialog from '@radix-ui/react-dialog';
import { FaTimes } from 'react-icons/fa';

interface ModalBaseProps {
    isOpen: boolean;
    title: string;
    handleClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const ModalBase = ({ isOpen, title, handleClose, children, footer }: ModalBaseProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="backdrop-blur-sm bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-50"
                    aria-hidden="true"
                />
                <Dialog.Content
                    aria-labelledby="modal-title"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 min-w-[50rem] max-w-full shadow-lg z-50 transition-all duration-500 ease-in-out"
                >
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <Dialog.Title id="modal-title" className="text-xl font-semibold text-gray-800">
                            {title}
                        </Dialog.Title>
                        <button
                            onClick={handleClose}
                            aria-label="Fechar"
                            className="text-gray-500 hover:text-gray-800 focus:outline-none transition"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div className="mb-4">{children}</div>
                    {footer && (
                        <div className="mt-4 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ModalBase;
