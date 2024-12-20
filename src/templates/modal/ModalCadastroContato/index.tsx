import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ModalBase from '../../../components/ModalBase';
import Formulario from '../../../components/Input';
import { Contato, ContatoCadastro } from '../../../types/contato.d';
import Botao from '../../../components/Button';
import { postContato, putContato } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';
import { removeMascara } from '../../../utils/formatar';

interface ModalCadastroContatoProps {
    isOpen: boolean;
    handleClose: () => void;
    contato: Contato | null;
    carregaContatos: Function;
}

export const ModalCadastroContato = ({ isOpen, handleClose, carregaContatos, contato }: ModalCadastroContatoProps) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContatoCadastro>();
    const [salvando, setSalvando] = useState<boolean>(false);
    const toast = useToastLoading();

    async function cadastrarContato() {
        setSalvando(true);
        toast({ mensagem: "Salvando Contato" });
        let dadosCadastro: ContatoCadastro;

        await handleSubmit((dadosForm) => {
            dadosCadastro = {
                ...dadosForm,
                numero: removeMascara(dadosForm.numero)
            };
        })();

        const request = () => contato?.id ? putContato(dadosCadastro) : postContato(dadosCadastro);

        try {
            const response = await request();
            if (response.sucesso) {
                carregaContatos();
                handleClose();
                toast({ tipo: response.tipo, mensagem: "Contato salvo com sucesso!" });
            } else {
                toast({ tipo: response.tipo, mensagem: response.mensagem });
            }
        } catch (err) {
            toast({ tipo: "error", mensagem: "Erro ao salvar contato!" });
        } finally {
            setSalvando(false);
        }
    }

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
                    required="O nome é obrigatório" // Mensagem de validação
                    register={register}
                    errors={errors} // Passando os erros do react-hook-form
                    disabled={salvando}
                    opcional={false}
                    lowercase
                    placeholder="Digite o nome"
                />
                <Formulario.InputCelular
                    name="numero"
                    label="Celular"
                    required="O número de celular é obrigatório" // Mensagem de validação
                    register={register}
                    errors={errors}
                    disabled={salvando}
                    opcional={false}
                    tamanhoMascara={10}
                />

            </Formulario>
        </ModalBase>
    );
};
