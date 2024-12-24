import ModalBase from '../../../components/ModalBase';
import useToastLoading from '../../../hooks/useToastLoading';
import { postEnviarMensagemGrupo } from '../../../services/mensagem';
import { EnviarMensagemGrupo } from '../../../types/mensagem.d';
import { GrupoDeContato } from '../../../types/grupoDeContatos';
import { InputEnvioMensagem } from '../../../components/InputEnvioMensagem';

interface ModalCadastroContatoProps {
    isOpen: boolean;
    handleClose: () => void;
    grupoContato: GrupoDeContato | null;
}

export const ModalEnvioMensagemGrupo = ({ isOpen, handleClose, grupoContato }: ModalCadastroContatoProps) => {
    const toast = useToastLoading();

    const enviarMensagemGrupo = async (novaMensagem: string) => {
        toast({ mensagem: "Enviando Mensagem" });
        let dadosMensagem: EnviarMensagemGrupo;

        dadosMensagem = {
            texto: novaMensagem,
            grupoIds: [grupoContato?.id || 0]
        };

        const request = () => postEnviarMensagemGrupo(dadosMensagem);

        const response = await request();
        if (response.sucesso) {
            handleClose();
            toast({ tipo: response.tipo, mensagem: "Mensagem enviada com sucesso!" });
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
    }

    return (
        <ModalBase
            isOpen={isOpen}
            title="Enviar Mensagem"
            handleClose={handleClose}
        >
            <InputEnvioMensagem enviarMensagem={enviarMensagemGrupo} />
        </ModalBase>
    );
};
