import * as Dialog from '@radix-ui/react-dialog';

export const ModalPerfil = ({ isOpen, handleClose, handleSave }: { isOpen: boolean, handleClose: () => void, handleSave: () => void }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleClose}
                    aria-hidden="true"
                />

                <Dialog.Content
                    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-xl z-50 transition-all duration-500 ease-in-out `}
                >
                    <Dialog.Title id="modal-title" className="text-xl font-semibold mb-4">Atualizar Perfil</Dialog.Title>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm text-gray-700">Nome</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                placeholder="Digite seu nome"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profile-photo" className="block text-sm text-gray-700">Foto de Perfil</label>
                            <input
                                id="profile-photo"
                                type="file"
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-gray-300 py-2 px-4 rounded-md"
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-green-600 text-white py-2 px-4 rounded-md"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};