import * as Dialog from '@radix-ui/react-dialog';
import Formulario from '../../../components/Input';
import { Contato, ContatoCadastro } from '../../../types/contato.d';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface ModalCadastroContatoComponentProps {
    isOpen: boolean;
    salvando: boolean;
    handleClose: () => void;
    onSave: (contato: Contato) => void;
    contato: Contato | null;
}

const ModalCadastroContato = ({ isOpen, handleClose, salvando, onSave, contato }: ModalCadastroContatoComponentProps) => {
    const { register, handleSubmit, reset } = useForm<ContatoCadastro>();

    function cadastrarContato() {
        console.log(contato)
        handleSubmit(dadosForm => {
            onSave({
                id: contato?.id,
                nome: dadosForm.nome,
                numero: dadosForm.numero
            })
        })();
    }

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    useEffect(() => {
        if (contato)
            reset({ ...contato });
    }, [contato]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={handleClose}
                    aria-hidden="true"
                />
                <Dialog.Content
                    aria-labelledby="cadastro-contato-title"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-xl z-50 transition-all duration-500 ease-in-out"
                >
                    <Dialog.Title id="cadastro-contato-title" className="text-xl font-semibold mb-4">Cadastrar Contato</Dialog.Title>
                    <Formulario className="flex flex-col gap-4 lg:col-span-3">
                        <Formulario.InputTexto
                            name="nome"
                            label="Nome"
                            register={register}
                            opcional={false}
                            placeholder="Nome"
                            disabled={salvando}
                            lowercase
                        />

                        <Formulario.InputCelular
                            name="numero"
                            label="Celular"
                            register={register}
                            opcional={false}
                            disabled={salvando}
                            lowercase
                        />
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
                                onClick={cadastrarContato}
                                className="bg-green-600 text-white py-2 px-4 rounded-md"
                            >
                                Salvar
                            </button>
                        </div>
                    </Formulario>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ModalCadastroContato;
