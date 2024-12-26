import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Contato } from "../../../types/contato.d";
import { formatarTelefone } from '../../../utils/formatar';
import { deleteContato, postListContatoFiltro } from "../../../services/contato";
import { ModalCadastroContato } from "../../modal/ModalCadastroContato";
import Loading from "../../../components/Loading";
import { HeaderComponent } from "../../../components/HeaderListagem";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import Modal from "../../../components/Modal";
import { ConversaListagem } from "../../../types/conversa.d";
import { itensMenu } from "../../../types/itensMenu.d";
import { baseFiltros } from "../../../types/baseEntity.d";
import InfiniteScroll from 'react-infinite-scroll-component';

interface ContatoComponentProps {
    setConversaSelecionada: React.Dispatch<React.SetStateAction<ConversaListagem | null>>
    setActiveSection: React.Dispatch<React.SetStateAction<itensMenu>>
}

export const ListagemContato = ({ setConversaSelecionada, setActiveSection }: ContatoComponentProps) => {
    const [listaContatos, setListaContato] = useState<Array<Contato>>([]);
    const [isModalCadastroContatoOpen, setIsModalCadastroContatoOpen] = useState(false);
    const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
    const [pesquisaContato, setPesquisaContato] = useState<string>('');
    const [confirmacaoDeletar, setConfirmacaoDeletar] = useState<boolean>(false);
    const toast = useToastLoading();
    const [paginaAtual, setPaginaAtual] = useState<number>(0);
    const [totalRegistros, setTotalRegistros] = useState<number>(0);
    const [totalPaginas, setTotalPaginas] = useState<number>(0);
    const registrosPorPagina: number = 10;

    const handleCloseModalCadastroContato = () => {
        setContatoSelecionado(null);
        setIsModalCadastroContatoOpen(false);
    };

    const handleContatoEdit = (contato: Contato) => {
        setIsModalCadastroContatoOpen(true);
        setContatoSelecionado(contato);
    };

    function abrirModalExcluir(dados: Contato): void {
        setContatoSelecionado(dados);
        setConfirmacaoDeletar(true);
    }

    async function confirmDeleteContato(): Promise<void> {
        if (!contatoSelecionado) {
            toast({ tipo: "error", mensagem: "Erro ao deletar: nenhum item selecionado!" });
            return;
        }
        const response = await deleteContato(contatoSelecionado.id);

        if (response.sucesso) {
            carregaContatos();
            setContatoSelecionado(null);
            toast({ tipo: 'success', mensagem: 'Contato deletado com sucesso.' });
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
    }

    const carregaContatos = async (pageSize: number = registrosPorPagina, currentPage: number = 0): Promise<void> => {
        const filtros: baseFiltros = {
            pageSize,
            currentPage,
            pesquisa: pesquisaContato,
        };

        const response = await postListContatoFiltro(filtros);
        if (response.sucesso) {
            setListaContato((prev) => currentPage === 0 ? response.dados.dados : [...prev, ...response.dados.dados]);
            setPaginaAtual(response.dados.currentPage);
            setTotalRegistros(response.dados.totalRegisters);
            setTotalPaginas(response.dados.totalPages);
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const carregaMaisContatos = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual((prev) => prev + 1);
            carregaContatos(registrosPorPagina, paginaAtual + 1);
        }
    };
    
    const clickCriarConversa = (contato?: Contato) => {
        const conversa: ConversaListagem = {
            contatoId: contato?.id || 0,
            contatoNome: contato?.nome || '',
            contatoNumero: contato?.numero || '',
            ultimaMensagem: '',
            mensagensPendentes: 0,
            mensagens: []
        };

        setConversaSelecionada(conversa);
        setActiveSection('conversas');
    };

    const filtroDebounce = useDebounce(carregaContatos, 500);

    useEffect(() => {
        filtroDebounce();
    }, [pesquisaContato]);

    return (
        <>
            <HeaderComponent
                titulo="Contatos"
                pesquisa={pesquisaContato}
                setPesquisa={setPesquisaContato}
                setIsModalOpen={setIsModalCadastroContatoOpen}
                inputAtivo={true}
            />

            <InfiniteScroll
                dataLength={listaContatos.length}
                next={carregaMaisContatos}
                hasMore={listaContatos.length < totalRegistros}
                loader={<Loading />}
                scrollableTarget="id-do-container"
            >

                {totalRegistros > 0 ? (
                    listaContatos.map((contato) => (
                        <div
                            key={contato.id}
                            className="p-4 flex items-center space-x-4 hover:bg-gray-100 transition rounded-lg"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-lg font-semibold text-gray-800">
                                {contato?.nome?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div
                                className="flex-1 text-left cursor-pointer"
                                onClick={() => clickCriarConversa(contato)}
                            >
                                <h3 className="font-medium text-gray-900">{contato.nome}</h3>
                                <h4 className="text-sm text-gray-500">
                                    {formatarTelefone(contato.numero)}
                                </h4>
                            </div>
                            <div className="flex gap-2 items-center justify-center">
                                <FaEdit
                                    size="1.25rem"
                                    color="#6B7280"
                                    className="cursor-pointer transition-all duration-300 hover:text-blue-500 hover:scale-105"
                                    onClick={() => handleContatoEdit(contato)}
                                />
                                <FaTrash
                                    size="1.25rem"
                                    color="#EF4444"
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={() => abrirModalExcluir(contato)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhum contato disponível.</p>
                )}
            </InfiniteScroll>

            <ModalCadastroContato
                isOpen={isModalCadastroContatoOpen}
                handleClose={handleCloseModalCadastroContato}
                contato={contatoSelecionado}
                carregaContatos={carregaContatos}
            />

            <Modal open={confirmacaoDeletar} setOpen={setConfirmacaoDeletar}>
                <Modal.Titulo texto={`Deletar`} />
                <Modal.Descricao texto={`Deseja realmente deletar o contato "${contatoSelecionado?.nome}"?`} />
                <Modal.ContainerBotoes>
                    <Modal.BotaoAcao textoBotao="Deletar" acao={confirmDeleteContato} />
                    <Modal.BotaoCancelar acao={() => setContatoSelecionado(null)} />
                </Modal.ContainerBotoes>
            </Modal>
        </>
    );
};
