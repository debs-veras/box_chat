import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ModalBase from '../../../components/ModalBase';
import Formulario from '../../../components/Input';
import Botao from '../../../components/Button';
import useToastLoading from '../../../hooks/useToastLoading';
import { postEnviarMensagemGrupo } from '../../../services/mensagem';
import { EnviarMensagemGrupo } from '../../../types/mensagem.d';
import { GrupoDeContato } from '../../../types/grupoDeContatos';
import { REMETENTE_NUMERO } from '../../../utils/api';
import { FaPaperPlane } from 'react-icons/fa';

interface ModalCadastroContatoProps {
    isOpen: boolean;
    handleClose: () => void;
    grupoContato: GrupoDeContato | null;
}

export const ModalEnvioMensagemGrupo = ({ isOpen, handleClose, grupoContato }: ModalCadastroContatoProps) => {
    const { register, handleSubmit, reset } = useForm<EnviarMensagemGrupo>();
    const [salvando, setSalvando] = useState<boolean>(false);
    const toast = useToastLoading();

    async function enviarMensagemGrupo() {
        setSalvando(true);
        toast({ mensagem: "Enviando Mensagem" });
        let dadosMensagem: EnviarMensagemGrupo;

        await handleSubmit((dadosForm) => {
            dadosMensagem = {
                remetente: REMETENTE_NUMERO,
                texto: dadosForm.texto,
                grupoIds: grupoContato?.contatoIds ?? []
            };
        })();

        const request = () => postEnviarMensagemGrupo(dadosMensagem);

        const response = await request();
        if (response.sucesso) {
            handleClose();
            toast({ tipo: response.tipo, mensagem: "Mensagem enviada com sucesso!" });
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setSalvando(false);
    }

    useEffect(() => {
        reset({ texto: '' });
    }, [isOpen]);

    return (
        <ModalBase
            isOpen={isOpen}
            title="Enviar Mensagem"
            handleClose={handleClose}
            footer={
                <>
                    <Botao tipo="padrao" onClick={handleClose} texto="Cancelar" />
                    <Botao tipo="sucesso" onClick={enviarMensagemGrupo} texto="Enviar" icone={<FaPaperPlane size="1.25rem" color="#fff" />}/>
                </>
            }
        >
            <Formulario className="flex flex-col gap-4 lg:col-span-3">
                <Formulario.InputTexto
                    name="texto"
                    label="Mensagem"
                    register={register}
                    disabled={salvando}
                    opcional={false}
                    lowercase
                    placeholder="Digite sua mensagem"
                />
            </Formulario>
        </ModalBase>
    );
};
