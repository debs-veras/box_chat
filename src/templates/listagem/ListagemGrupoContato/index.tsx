import { useEffect, useState } from "react";
import { GrupoDeContato } from "../../../types/grupoDeContatos";
import { HeaderComponent } from "../../../components/HeaderListagem";
import useDebounce from "../../../hooks/useDebounce";
import useToastLoading from "../../../hooks/useToastLoading";
import { deleteGrupo, getListGrupo } from "../../../services/grupoContato";
import { FaEdit, FaPaperPlane, FaTrash, FaUsers } from "react-icons/fa";
import Loading from "../../../components/Loading";
import Modal from "../../../components/Modal";
import { ModalEnvioMensagemGrupo } from "../../modal/ModalEnvioMensagemGrupo";
import { ModalCadastroGruposDeContatos } from "../../modal/ModalCadastroGrupoContato";
import { baseFiltros } from "../../../types/baseEntity.d";
import InfiniteScroll from 'react-infinite-scroll-component';

interface ListagemGrupoContatoProps {
    setIsAtivaGrupoContato: React.Dispatch<React.SetStateAction<boolean>>;
    setGrupoSelecionado: React.Dispatch<React.SetStateAction<GrupoDeContato | null>>;
    grupoSelecionado: GrupoDeContato | null;
}

export const ListagemGrupoContato = ({ setIsAtivaGrupoContato, setGrupoSelecionado, grupoSelecionado }: ListagemGrupoContatoProps) => {
    const [pesquisaGrupoContato, setPesquisaGrupoContato] = useState<string>('');
    const toast = useToastLoading();
    const [listaGruposContatos, setListaGruposContatos] = useState<Array<GrupoDeContato>>([]);
    const [confirmacaoDeletar, setConfirmacaoDeletar] = useState<boolean>(false);
    const [isModalEnvioMensagemGrupoContatoOpen, setIsModalEnvioMensagemGrupoContatoOpen] = useState(false);
    const [isModalCadastroGrupoContatoOpen, setIsModalCadastroGrupoContatoOpen] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState<number>(0);
    const [totalRegistros, setTotalRegistros] = useState<number>(0);
    const [totalPaginas, setTotalPaginas] = useState<number>(0);
    const registrosPorPagina: number = 10;

    const carregaGrupoContato = async (pageSize: number = registrosPorPagina, currentPage: number = 0): Promise<void> => {

        const filtros: baseFiltros = {
            pageSize,
            currentPage,
            pesquisa: pesquisaGrupoContato,
        };

        const response = await getListGrupo(filtros);
        if (response.sucesso) {
            setListaGruposContatos((prev) => currentPage === 0 ? response.dados.dados : [...prev, ...response.dados.dados]);
            setPaginaAtual(response.dados.currentPage);
            setTotalRegistros(response.dados.totalRegisters);
            setTotalPaginas(response.dados.totalPages);
        } else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const carregaMaisContatos = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual((prev) => prev + 1);
            carregaGrupoContato(registrosPorPagina, paginaAtual + 1);
        }
    };

    const openIsAtivaGrupoContato = (grupo: GrupoDeContato) => {
        setGrupoSelecionado(grupo);
        setIsAtivaGrupoContato(true)
    };

    // Modal editar/cadastrar grupo de contatos
    const handleOpenModalCadastroGrupoContato = (grupo: GrupoDeContato) => {
        setGrupoSelecionado(grupo);
        setIsModalCadastroGrupoContatoOpen(true);
    };

    // Modal excluir grupo de contatos
    async function confirmDeleteGrupoContato(): Promise<void> {
        if (grupoSelecionado == null) {
            toast({ tipo: "error", mensagem: "Erro ao deletar: nenhum item selecionado!" })
            return;
        }
        const response = await deleteGrupo(grupoSelecionado.id);

        if (response.sucesso) {
            carregaGrupoContato();
            setGrupoSelecionado(null)
            toast({ tipo: 'success', mensagem: 'Grupo deletado com sucesso.' });
        }
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
    }

    const openModalExcluirGrupoContato = (dados: GrupoDeContato) => {
        setGrupoSelecionado(dados);
        setConfirmacaoDeletar(true);
    }

    // Modal Envio de Mensagem
    const handleCloseModalEnvioMensagemGrupoContato = () => {
        setGrupoSelecionado(null);
        setIsModalEnvioMensagemGrupoContatoOpen(false);
    };

    const handleOpenModalEnvioMensagemGrupoContato = (grupo: GrupoDeContato) => {
        setIsModalEnvioMensagemGrupoContatoOpen(true);
        setGrupoSelecionado(grupo);
    };

    const filtroDebounce = useDebounce(carregaGrupoContato, 500);

    useEffect(() => {
        filtroDebounce();
    }, [pesquisaGrupoContato])

    return (
        <>
            <HeaderComponent
                titulo="Grupos"
                setIsModalOpen={setIsModalCadastroGrupoContatoOpen}
                inputAtivo={true}
                pesquisa={pesquisaGrupoContato}
                setPesquisa={setPesquisaGrupoContato}
            />

            <div className=" py-2 flex flex-col">
                <InfiniteScroll
                    dataLength={listaGruposContatos.length}
                    next={carregaMaisContatos}
                    hasMore={listaGruposContatos.length < totalRegistros}
                    loader={<Loading />}
                    scrollableTarget="id-do-container"
                >
                    {totalRegistros > 0 ? (
                        listaGruposContatos.map((grupo, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-4 gap-1 p-4  border-b hover:shadow-sm transition-shadow   ${grupoSelecionado?.id === grupo.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                            >
                                <div
                                    className="col-span-3 truncate items-start flex flex-col cursor-pointer"
                                    onClick={() => openIsAtivaGrupoContato(grupo)}>
                                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                                        {grupo.nome}
                                    </h3>
                                    <span className="text-sm text-gray-500 truncate">
                                        {grupo.descricao}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <FaUsers className="text-blue-500" />
                                        <span className="text-sm text-gray-500">
                                            {grupo.contatoIds?.length ?? 0} membros
                                        </span>
                                    </div>
                                </div>

                                <div className="xl:col-span-1 sm:col-span-4 sm:justify-start flex gap-2 items-center justify-center">
                                    <FaEdit
                                        size="1.25rem"
                                        color="#54656F"
                                        className="cursor-pointer transition-all duration-300"
                                        onClick={() => handleOpenModalCadastroGrupoContato(grupo)}
                                    />

                                    <FaTrash
                                        size="1.25rem"
                                        color="red"
                                        className="cursor-pointer transition-all duration-300"
                                        onClick={() => openModalExcluirGrupoContato(grupo)}
                                    />

                                    <FaPaperPlane
                                        size="1.25rem"
                                        color="#54656F"
                                        className="cursor-pointer transition-all duration-300"
                                        onClick={() => handleOpenModalEnvioMensagemGrupoContato(grupo)}
                                    />
                                </div>
                            </div>

                        ))) : <p>Nenhum contato disponível.</p>
                    }
                </InfiniteScroll>
            </div>

            <ModalEnvioMensagemGrupo
                isOpen={isModalEnvioMensagemGrupoContatoOpen}
                handleClose={handleCloseModalEnvioMensagemGrupoContato}
                grupoContato={grupoSelecionado}
            />

            <ModalCadastroGruposDeContatos
                isOpen={isModalCadastroGrupoContatoOpen}
                setIsOpen={setIsModalCadastroGrupoContatoOpen}
                setGrupoDeContatoSelecionado={setGrupoSelecionado}
                grupoDeContatoSelecionado={grupoSelecionado}
                carregaGruposContatos={filtroDebounce}
            />

            <Modal open={confirmacaoDeletar} setOpen={setConfirmacaoDeletar}>
                <Modal.Titulo texto={`Deletar`} />
                <Modal.Descricao texto={`Deseja realmente deletar o grupo "${grupoSelecionado?.nome}"?`} />
                <Modal.ContainerBotoes>
                    <Modal.BotaoAcao textoBotao="Deletar" acao={confirmDeleteGrupoContato} />
                    <Modal.BotaoCancelar acao={() => setGrupoSelecionado(null)} />
                </Modal.ContainerBotoes>
            </Modal>
        </>
    );
};
