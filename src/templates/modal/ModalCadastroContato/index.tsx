import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ModalBase from '../../../components/ModalBase';
import Formulario from '../../../components/Input';
import { Contato, ContatoCadastro } from '../../../types/contato.d';
import Botao from '../../../components/Button';

interface ModalCadastroContatoProps {
    isOpen: boolean;
    salvando: boolean;
    handleClose: () => void;
    onSave: (contato: Contato) => void;
    contato: Contato | null;
}

export const ModalCadastroContato = ({ isOpen, handleClose, salvando, onSave, contato }: ModalCadastroContatoProps) => {
    const { register, handleSubmit, reset } = useForm<ContatoCadastro>();

    const cadastrarContato = () => {
        handleSubmit(dadosForm => {
            onSave({
                id: contato?.id,
                nome: dadosForm.nome,
                numero: dadosForm.numero,
            });
        })();
    };

    useEffect(() => {
        if (contato) reset({ ...contato });
        else reset({ nome: '', numero: '' });

    }, [isOpen]);

    return (
        <ModalBase
            isOpen={isOpen}
            title="Cadastrar Contato"
            handleClose={handleClose}
            footer={
                <>
                    <Botao tipo="padrao" onClick={handleClose} texto="Cancelar" />
                    <Botao tipo="sucesso" onClick={cadastrarContato} texto="Salvar" />
                </>
            }
        >
            <Formulario className="flex flex-col gap-4 lg:col-span-3">
                <Formulario.InputTexto
                    name="nome"
                    label="Nome"
                    register={register}
                    opcional={false}
                    placeholder="Nome"
                    disabled={salvando}
                />
                <Formulario.InputCelular
                    name="numero"
                    label="Celular"
                    register={register}
                    opcional={false}
                    disabled={salvando}
                />
            </Formulario>
        </ModalBase>
    );
};
