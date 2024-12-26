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
import { ModalCAdastroGruposDeContatos } from "../../modal/ModalCadastroGrupoContato";

interface ListagemGrupoContatoProps {
    setIsAtivaGrupoContato: React.Dispatch<React.SetStateAction<boolean>>;
    setGrupoSelecionado: React.Dispatch<React.SetStateAction<GrupoDeContato | null>>;
    grupoSelecionado: GrupoDeContato | null;
}

export const ListagemGrupoContato = ({ setIsAtivaGrupoContato, setGrupoSelecionado, grupoSelecionado }: ListagemGrupoContatoProps) => {
    const [pesquisaGrupoContato, setPesquisaGrupoContato] = useState<string>('');
    const toast = useToastLoading();
    const [loading, setLoading] = useState<boolean>(false);
    const [gruposContatosFiltrados, setGruposContatosFiltrados] = useState<Array<GrupoDeContato>>([]);
    const [gruposDeContatos, setGruposDeContatos] = useState<Array<GrupoDeContato>>([]);
    const [confirmacaoDeletar, setConfirmacaoDeletar] = useState<boolean>(false);
    const [isModalEnvioMensagemGrupoContatoOpen, setIsModalEnvioMensagemGrupoContatoOpen] = useState(false);
    const [isModalCadastroGrupoContatoOpen, setIsModalCadastroGrupoContatoOpen] = useState(false);

    const carregaGrupoContato = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListGrupo();
        const response = await request();
        if (response.sucesso) setGruposDeContatos(response.dados);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setLoading(false);
    };

    const handleCloseModalCadastroGrupoContato = () => {    
        setIsModalCadastroGrupoContatoOpen(false);
    };

    const editGrupoContatos = (grupo: GrupoDeContato) => {
        setGrupoSelecionado(grupo);
        setIsModalCadastroGrupoContatoOpen(true);
    };

    const openIsAtivaGrupoContato = (grupo: GrupoDeContato) => {
        setGrupoSelecionado(grupo);
        setIsAtivaGrupoContato(true)
    };

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

    function openModalExcluirGrupoContato(dados: GrupoDeContato): void {
        setGrupoSelecionado(dados);
        setConfirmacaoDeletar(true);
    }

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
    }, [])

    useEffect(() => {
        if (!pesquisaGrupoContato.trim()) setGruposContatosFiltrados(gruposDeContatos);
        else {
            const termo = pesquisaGrupoContato.toLowerCase();
            const gruposFiltrados = gruposDeContatos.filter((grupo) => {
                const nomeGrupo = grupo?.nome.toLowerCase();
                return nomeGrupo?.includes(termo)
            });
            setGruposContatosFiltrados(gruposFiltrados);
        }
    }, [pesquisaGrupoContato, gruposDeContatos]);

    return (
        <>
            <HeaderComponent
                titulo="Grupos"
                setIsModalOpen={setIsAtivaGrupoContato}
                inputAtivo={true}
                pesquisa={pesquisaGrupoContato}
                setPesquisa={setPesquisaGrupoContato}
            />

            <div className=" py-2 flex flex-col">
                {loading ? (
                    <Loading />
                ) : (
                    gruposContatosFiltrados.length > 0 ? (
                        gruposContatosFiltrados.map((grupo) => (
                            <div
                                onClick={() => openIsAtivaGrupoContato(grupo)}
                                key={grupo.id}
                                className={`grid grid-cols-4 gap-1 p-4  border-b hover:shadow-sm transition-shadow cursor-pointer  ${grupoSelecionado?.id === grupo.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                            >
                                <div className="col-span-3 truncate items-start flex flex-col">
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
                                        onClick={() => editGrupoContatos(grupo)}

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
                )}
            </div>

            <ModalEnvioMensagemGrupo
                isOpen={isModalEnvioMensagemGrupoContatoOpen}
                handleClose={handleCloseModalEnvioMensagemGrupoContato}
                grupoContato={grupoSelecionado}
            />

            <ModalCAdastroGruposDeContatos
                isOpen={isModalCadastroGrupoContatoOpen}
                handleClose={handleCloseModalCadastroGrupoContato}
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
