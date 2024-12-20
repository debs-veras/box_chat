import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Contato } from "../../../types/contato.d";
import { formatarTelefone } from '../../../utils/formatar';
import { deleteContato, getListContatos } from "../../../services/contato";
import { ModalCadastroContato } from "../../modal/ModalCadastroContato";
import Loading from "../../../components/Loading";
import { HeaderComponent } from "../../../components/HeaderListagem";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import Modal from "../../../components/Modal";
import { ConversaListagem } from "../../../types/conversa.d";
import { itensMenu } from "../../../types/itensMenu.d";

interface ContatoComponentProps {
    setConversaSelecionada: React.Dispatch<React.SetStateAction<ConversaListagem | null>>
    setActiveSection: React.Dispatch<React.SetStateAction<itensMenu>>
}

export const ListagemContato = ({ setConversaSelecionada, setActiveSection }: ContatoComponentProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [listaContatos, setListaContato] = useState<Array<Contato>>([]);
    const [listaContatosFiltrados, setListaContatosFiltrados] = useState<Array<Contato>>([]);
    const [isModalCadastroContatoOpen, setIsModalCadastroContatoOpen] = useState(false);
    const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
    const [pesquisaContato, setPesquisaContato] = useState<string>('');
    const [confirmacaoDeletar, setConfirmacaoDeletar] = useState<boolean>(false);
    const toast = useToastLoading();

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
        if (contatoSelecionado == null) {
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

    const carregaContatos = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListContatos();
        const response = await request();
        if (response.sucesso) setListaContato(response.dados);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setLoading(false);
    };

    const clickCriarConversa = (contato?: Contato) => {
        let conversa: ConversaListagem = {
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
        if (!pesquisaContato.trim())
            setListaContatosFiltrados(listaContatos);
        else {
            const termo = pesquisaContato.toLowerCase();
            const contatosFiltrados = listaContatos.filter((contato) => {
                const nomeContato = contato?.nome.toLowerCase();
                const numeroContato = contato?.numero?.replace(/\D/g, '');
                return nomeContato?.includes(termo) || numeroContato?.includes(termo);
            });
            setListaContatosFiltrados(contatosFiltrados);
        }
    }, [pesquisaContato, listaContatos]);

    useEffect(() => {
        filtroDebounce();
    }, []);

    return (
        <>
            <HeaderComponent
                titulo="Contatos"
                pesquisa={pesquisaContato}
                setPesquisa={setPesquisaContato}
                setIsModalOpen={setIsModalCadastroContatoOpen}
                inputAtivo={true}
            />

            {!loading ? (
                listaContatosFiltrados.length > 0 ? (
                    listaContatosFiltrados.map((contato) => (
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
                )
            ) : (
                <Loading />
            )}

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
