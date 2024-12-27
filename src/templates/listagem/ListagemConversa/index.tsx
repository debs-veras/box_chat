import { useEffect, useState } from "react";
import { HeaderComponent } from "../../../components/HeaderListagem";
import { ConversaListagem } from "../../../types/conversa.d";
import { getListUltimasConversa } from "../../../services/conversa";
import useToastLoading from "../../../hooks/useToastLoading";
import Loading from "../../../components/Loading";
import { baseFiltros } from "../../../types/baseEntity.d";
import useDebounce from "../../../hooks/useDebounce";
import InfiniteScroll from 'react-infinite-scroll-component';

interface ConversaComponentProps {
    conversaSelecionada: ConversaListagem | null;
    setConversaSelecionada: React.Dispatch<React.SetStateAction<ConversaListagem | null>>
}

export const ListagemConversa = ({ conversaSelecionada, setConversaSelecionada }: ConversaComponentProps) => {
    const [pesquisaConversa, setPesquisaConversa] = useState<string>('');
    const [listaConversas, setListaConversas] = useState<Array<ConversaListagem>>([]);
    const toast = useToastLoading();
    const [paginaAtual, setPaginaAtual] = useState<number>(0);
    const [totalRegistros, setTotalRegistros] = useState<number>(0);
    const [totalPaginas, setTotalPaginas] = useState<number>(0);
    const registrosPorPagina: number = 10;

    const handleConversationClick = (conversas: ConversaListagem) => {
        setConversaSelecionada(conversas);
    };

    const carregaUltimasConversas = async (pageSize: number = registrosPorPagina, currentPage: number = 0): Promise<void> => {

        const filtros: baseFiltros = {
            pageSize,
            currentPage,
            pesquisa: pesquisaConversa,
        };

        const response = await getListUltimasConversa(filtros);

        if (response.sucesso) {
            setListaConversas((prev) => currentPage === 0 ? response.dados.dados : [...prev, ...response.dados.dados]);
            setPaginaAtual(response.dados.currentPage);
            setTotalRegistros(response.dados.totalRegisters);
            setTotalPaginas(response.dados.totalPages);
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const carregaMaisConversas = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual((prev) => prev + 1);
            carregaUltimasConversas(registrosPorPagina, paginaAtual + 1);
        }
    };

    const filtroDebounce = useDebounce(carregaUltimasConversas, 500);

    useEffect(() => {
        filtroDebounce();
    }, [pesquisaConversa]);

    return (
        <>
            <HeaderComponent
                titulo="Conversas"
                pesquisa={pesquisaConversa}
                setPesquisa={setPesquisaConversa}
                inputAtivo={true}
            />

            <InfiniteScroll
                dataLength={totalRegistros}
                next={carregaMaisConversas}
                hasMore={totalRegistros < totalRegistros}
                loader={<Loading />}
                scrollableTarget="id-do-container"
            >
                {totalRegistros > 0 ? (
                    listaConversas.map((conversa) => (
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
                )}
            </InfiniteScroll>
        </>
    );
};
