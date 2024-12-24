import { useEffect, useRef, useState } from "react";
import { ListagemMensagem } from "../../listagem/ListagemMensagem";
import { formatarTelefone } from "../../../utils/formatar";
import { Mensagem } from "../../../types/mensagem.d";
import { ConversaListagem } from "../../../types/conversa.d";
import { itensMenu } from "../../../types/itensMenu.d";
import { getListConversa } from "../../../services/conversa";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { REMETENTE_NUMERO } from "../../../utils/api";
import { InputEnvioMensagem } from "../../../components/InputEnvioMensagem";
import { postEnviarMensagem } from "../../../services/mensagem";
interface ChatDeMensagemProps {
    activeSection: itensMenu;
    conversaSelecionada: ConversaListagem | null;
}

export const ChatDeMensagem = ({ activeSection, conversaSelecionada }: ChatDeMensagemProps) => {
    const toast = useToastLoading();
    const mensagemEndRef = useRef<HTMLDivElement>(null);
    const [userId] = useState<string>(REMETENTE_NUMERO);
    const [mensagem, setMensagem] = useState<Mensagem[]>([]);
    const [showInput, setShowInput] = useState(false);

    const toggleInput = () => {
        setShowInput((prev) => !prev);
    };

    const carregaMensagem = async (): Promise<void> => {
        const request = () => getListConversa(conversaSelecionada?.contatoId ?? 0);
        const response = await request();
        if (response.sucesso) setMensagem(response.dados.mensagens);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const enviarMensagem = async (novaMensagem: string) => {
        if (novaMensagem.trim() !== '') {
            const tempo = new Date().toISOString();
            const msg = {
                remetente: userId,
                texto: novaMensagem,
                horario: tempo,
                data_envio: tempo,
                data_recebimento: '',
                data_visualizacao: '',
            };

            const request = () => postEnviarMensagem({ contatoId: conversaSelecionada?.contatoId ?? null, texto: novaMensagem, dataEnvio: tempo });
            const response = await request();
            if (response.sucesso && setMensagem) setMensagem((prevMessages) => [...prevMessages, msg]);
            else toast({ tipo: response.tipo, mensagem: response.mensagem });
        }
    };

    const filtroDebounce = useDebounce(carregaMensagem, 500);

    useEffect(() => {
        setShowInput(false);
    }, [activeSection, conversaSelecionada]);

    useEffect(() => {
        filtroDebounce();
    }, [conversaSelecionada]);

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-[#F0F2F5] shadow-sm">
                <div className="flex items-center space-x-4">
                    <img src={'imagens/user.png'} alt="Perfil" className="w-12 h-12 rounded-full object-cover" />
                    <div className='flex flex-col items-start'>
                        <span className="text-lg">{conversaSelecionada?.contatoNome}</span>
                        <span className="text-sm text-zinc-400">{formatarTelefone(conversaSelecionada?.contatoNumero || '')}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 relative">
                    <FaSearch
                        size="1.2rem"
                        className={`${showInput ? 'absolute transform -translate-y-1/2 left-4 top-1/2 ' : 'relative'} cursor-pointer`}
                        onClick={toggleInput}
                    />
                    <div
                        className={`rounded px-2 py-1 transition-all duration-300 overflow-hidden ${showInput ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
                    >
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-[#DAD7D3] rounded-md border-none focus:outline-none"
                            placeholder="Digite sua busca"
                        />
                    </div>
                    <FaEllipsisV size="1.2rem" className="cursor-pointer" />
                </div>
            </div>

            <ListagemMensagem mensagem={mensagem} mensagemEndRef={mensagemEndRef} userId={userId} />

            <InputEnvioMensagem
                activeSection={activeSection}
                conversaSelecionada={conversaSelecionada}
                enviarMensagem={enviarMensagem}
            />
        </>
    );
};
