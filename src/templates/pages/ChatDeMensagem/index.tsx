import { useEffect, useRef, useState } from "react";
import { ListagemMensagem } from "../../listagem/ListagemMensagem";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { formatarTelefone } from "../../../utils/formatar";
import { postEnviarMensagem } from "../../../services/mensagem";
import { ModeloMensagem } from "../../../types/modeloMensagem";
import { Mensagem } from "../../../types/mensagem.d";
import { ConversaListagem } from "../../../types/conversa.d";
import { itensMenu } from "../../../types/itensMenu.d";
import { getListConversa } from "../../../services/conversa";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import { FaPaperPlane, FaSmile, FaPaperclip, FaEllipsisV, FaSearch } from "react-icons/fa";
import { REMETENTE_NUMERO } from "../../../utils/api";
interface ChatDeMensagemProps {
    modelos: Array<ModeloMensagem>;
    activeSection: itensMenu;
    conversaSelecionada: ConversaListagem | null;
}

export const ChatDeMensagem = ({ modelos, activeSection, conversaSelecionada }: ChatDeMensagemProps) => {
    const toast = useToastLoading();
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const mensagemEndRef = useRef<HTMLDivElement>(null);
    const [modelosFiltrados, setModelosFiltrados] = useState<ModeloMensagem[]>(modelos);
    const [userId] = useState<string>(REMETENTE_NUMERO);
    const [mensagem, setMensagem] = useState<Mensagem[]>([]);
    const [novaMensagem, setNovaMensagem] = useState<string>('');
    const [exibirModelos, setExibirModelos] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const enviarMensagem = async () => {
        if (novaMensagem.trim() !== '') {
            const tempo = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const msg = {
                id: Date.now(),
                remetente: userId,
                texto: novaMensagem,
                horario: tempo,
                data_envio: tempo,
                data_recebimento: '',
                data_visualizacao: '',
            };

            const request = () => postEnviarMensagem({ remetente: userId, destinatario: conversaSelecionada?.contatoNumero ?? '', texto: novaMensagem });
            const response = await request();
            if (response.sucesso) setMensagem((prevMessages) => [...prevMessages, msg]);
            else toast({ tipo: response.tipo, mensagem: response.mensagem });
            setNovaMensagem('');
        }
    };

    const toggleInput = () => {
        setShowInput((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNovaMensagem(value);
        if (value.startsWith("/")) {
            const termoFiltro = value.slice(1).trim().toLowerCase();
            const modelosFiltrados = modelos.filter(modelo => modelo.titulo.toLowerCase().includes(termoFiltro));
            const modeloSelecionado = modelos.find(modelo => modelo.titulo.toLowerCase() === termoFiltro.toLowerCase());
            setModelosFiltrados(modelosFiltrados);
            if (modeloSelecionado) {
                const modeloComTagsSubstituídas = substituirTags(modeloSelecionado.conteudo, conversaSelecionada ?? null);
                setNovaMensagem(modeloComTagsSubstituídas);
            }
            setExibirModelos(true);
        } else setExibirModelos(false);

    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            enviarMensagem();
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setNovaMensagem(prev => prev + emoji.native);
    };

    const substituirTags = (texto: string, contato?: ConversaListagem | null): string => {
        setExibirModelos(false);
        return texto
            .replace(/{nome}/g, contato?.contatoNome || "usuário")
            .replace(/{numero}/g, contato?.contatoNumero || "desconhecido");
    };

    const carregaMensagem = async (): Promise<void> => {
        const request = () => getListConversa(conversaSelecionada?.contatoId ?? 0);
        const response = await request();
        if (response.sucesso) setMensagem(response.dados.mensagens);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const filtroDebounce = useDebounce(carregaMensagem, 500);

    useEffect(() => {
        setNovaMensagem('');
        setExibirModelos(false);
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

            <div className="flex items-center gap-2 p-4 bg-[#F0F2F5] shadow-lg flex-wrap">
                <div className='flex gap-5 relative'>
                    <FaPaperclip
                        size="1.25rem"
                        className="hover:text-gray-400 text-xl cursor-pointer text-gray-500"
                    />

                    <FaSmile
                        size="1.25rem"
                        className="text-gray-700 text-xl cursor-pointer hover:text-gray-600"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />

                    {showEmojiPicker && (
                        <div className="absolute bottom-10 left-0 z-10">
                            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                        </div>
                    )}

                </div>

                <input
                    type="text"
                    placeholder="Digite uma mensagem"
                    value={novaMensagem}
                    onKeyDown={handleKeyPress}
                    onChange={handleInputChange}
                    className="flex-1 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {exibirModelos && modelosFiltrados.length > 0 && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-lg shadow-md bg-white w-full">
                        <ul className="space-y-2">
                            {modelosFiltrados.map((modelo) => (
                                <li
                                    key={modelo.id}
                                    className="cursor-pointer rounded-lg bg-gray-50 p-3 hover:bg-blue-50 transition-colors ease-in-out"
                                    onClick={() => setNovaMensagem(substituirTags(modelo.conteudo, conversaSelecionada))}
                                >
                                    <div className="font-semibold text-lg text-blue-600">{modelo.titulo}</div>
                                    <p className="text-sm text-gray-700 mt-1">{modelo.conteudo}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={enviarMensagem}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
                >
                    <FaPaperPlane size="1.25rem" color="#fff" className="mr-2" />
                    Enviar
                </button>
            </div>
        </>
    );
};
