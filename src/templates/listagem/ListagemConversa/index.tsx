import { useEffect, useState } from "react";
import { HeaderComponent } from "../../../components/HeaderListagem";
import { ConversaListagem } from "../../../types/conversa.d";
import { getListUltimasConversa } from "../../../services/conversa";
import useToastLoading from "../../../hooks/useToastLoading";
import Loading from "../../../components/Loading";

interface ConversaComponentProps {
    conversaSelecionada: ConversaListagem | null;
    setConversaSelecionada: React.Dispatch<React.SetStateAction<ConversaListagem | null>>
}

export const ListagemConversa = ({ conversaSelecionada, setConversaSelecionada }: ConversaComponentProps) => {
    const [pesquisaConversa, setPesquisaConversa] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [conversasFiltradas, setConversasFiltradas] = useState<Array<ConversaListagem>>([]);
    const [conversas, setConversas] = useState<Array<ConversaListagem>>([]);
    const toast = useToastLoading();

    const handleConversationClick = (conversas: ConversaListagem) => {
        setConversaSelecionada(conversas);
    };

    const carregaUltimasConversas = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListUltimasConversa();
        const response = await request();
        if (response.sucesso) setConversas(response.dados);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setLoading(false);
    };

    useEffect(() => {
        carregaUltimasConversas();
    }, []);

    useEffect(() => {
        if (!pesquisaConversa.trim())
            setConversasFiltradas(conversas);
        else {
            const termo = pesquisaConversa.toLowerCase();
            const conversasFiltradas = conversas.filter((conversa) => {
                const nomeContato = conversa.contatoNome.toLowerCase();
                return nomeContato?.includes(termo)
            });
            setConversasFiltradas(conversasFiltradas);
        }
    }, [pesquisaConversa, conversas]);

    return (
        <>
            <HeaderComponent
                titulo="Conversas"
                pesquisa={pesquisaConversa}
                setPesquisa={setPesquisaConversa}
                inputAtivo={true}
            />
            {!loading ?
                conversasFiltradas.length > 0 ? (
                    conversasFiltradas.map((conversa) => (
                        <div
                            key={conversa.id}
                            onClick={() => handleConversationClick(conversa)}
                            className={`p-4 cursor-pointer flex items-center space-x-4  ${conversaSelecionada?.id === conversa.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-lg font-semibold text-gray-800">
                                {conversa.contatoNome.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 text-left truncate">
                                <h3 className="text-md font-medium truncate">{conversa.contatoNome}</h3>
                                <p className="text-sm text-gray-500 truncate">{conversa.ultimaMensagem}</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className="text-xs text-gray-500">
                                    {/* {conversa.dataRecebimento} */}
                                </div>
                                {conversa.mensagensPendentes != 0 && (
                                    <div className="text-xs bg-red-500 text-white rounded-full px-2">
                                        {conversa.mensagensPendentes}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        Nenhuma conversa encontrada com o termo.
                    </div>
                )
                :
                <Loading />
            }
        </>
    );
};
