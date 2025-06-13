import { useEffect, useState } from "react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ModeloMensagem } from "../../types/modeloMensagem";
import { Conversa } from "../../types/Conversa.d";
import { itensMenu } from "../../types/itensMenu.d";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import Botao from "../Button";

interface InputEnvioMensagemProps {
    activeSection?: itensMenu;
    conversaSelecionada?: Conversa | null;
    enviarMensagem: (texto: string) => Promise<void>;
}

export const InputEnvioMensagem = ({ activeSection, conversaSelecionada, enviarMensagem }: InputEnvioMensagemProps) => {
    const modelos: Array<ModeloMensagem> = [
        {
            id: 1,
            titulo: "Saudação Pessoal",
            conteudo: "Olá {nome}, como posso ajudar você hoje?",
            tags: ["{nome}"],
        },
        {
            id: 2,
            titulo: "Confirmação de Pedido",
            conteudo: "Olá {nome}, seu pedido #{numero} foi confirmado com sucesso!",
            tags: ["{nome}", "{numero}"],
        },
    ];
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [modelosFiltrados, setModelosFiltrados] = useState<ModeloMensagem[]>(modelos);
    const [novaMensagem, setNovaMensagem] = useState<string>('');
    const [exibirModelos, setExibirModelos] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const handleEnviar = async () => {
        setEnviando(true);
        await enviarMensagem(novaMensagem);
        setNovaMensagem('');
        setEnviando(false);

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
            handleEnviar();
        }
    };

    const handleEmojiSelect = (emoji) => {
        setNovaMensagem(prev => prev + emoji.native);
    };

    const substituirTags = (texto: string, contato?: Conversa | null): string => {
        setExibirModelos(false);
        return texto.replace(/{nome}/g, contato?.usuarioId || "usuário")
    };

    useEffect(() => {
        setNovaMensagem('');
        setExibirModelos(false);
    }, [activeSection, conversaSelecionada]);

    return (
        <>
            <div className="flex items-center gap-2 p-4 bg-[#F0F2F5] shadow-lg flex-wrap">
                <div className='flex gap-5 relative'>
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

                <Botao
                    texto={"Enviar"}
                    tipo="informacao"
                    icone={<FaPaperPlane size="1rem" color="#fff" className="mr-2" />}
                    disabled={enviando}
                    carregando={enviando}
                    onClick={handleEnviar}
                />
            </div>
        </>
    );
};
