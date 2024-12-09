import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contato } from "../../../types/contato.d";
import { formatarTelefone } from '../../../utils/formatar';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { deleteContato, getListContatos } from "../../../services/contato";
import { ModalCadastroContato } from "../../modal/ModalCadastroContato";
import Loading from "../../../components/Loading";
import { HeaderComponent } from "../../../components/HeaderListagem";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import Modal from "../../../components/Modal";

interface ContatoComponentProps {
    ClickCriarConversa: (contato?: Contato) => void;
}

export const ListagemContato = ({ ClickCriarConversa }: ContatoComponentProps) => {
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
            toast({ tipo: "error", mensagem: "Erro ao deletar: nenhum item selecionado!" })
            return;
        }
        const response = await deleteContato(contatoSelecionado.id);

        if (response.sucesso) {
            carregaContatos();
            setContatoSelecionado(null)
            toast({ tipo: 'success', mensagem: 'Contato deletado com sucesso.' });
        }
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
    }

    const carregaContatos = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListContatos();
        const response = await request();
        if (response.sucesso) setListaContato(response.dados);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setLoading(false);
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
    }, [])

    return (
        <>
            <HeaderComponent
                titulo="Contatos"
                pesquisa={pesquisaContato}
                setPesquisa={setPesquisaContato}
                setIsModalOpen={setIsModalCadastroContatoOpen}
                inputAtivo={true}
            />

            {!loading ?
                listaContatosFiltrados.length > 0 ? (
                    listaContatosFiltrados.map((contato) => (
                        <div
                            key={contato.id}
                            className="p-4 flex items-center space-x-4 hover:bg-blue-50 transition"
                        >
                            <img
                                src={contato?.foto || '/imagens/user.png'}
                                alt="Perfil"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 text-left cursor-pointer" onClick={() => ClickCriarConversa(contato)}>
                                <h3 className="font-medium">{contato.nome}</h3>
                                <h4>{formatarTelefone(contato.numero)}</h4>
                            </div>
                            <div className="flex gap-2 items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    size="lg"
                                    color='#54656F'
                                    className="cursor-pointer transition-all duration-300"
                                    onClick={() => handleContatoEdit(contato)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    size="lg"
                                    color='red'
                                    className="cursor-pointer transition-all duration-300"
                                    onClick={() => abrirModalExcluir(contato)}
                                />
                            </div>
                        </div>
                    ))
                ) : <p>Nenhum contato disponível.</p>
                : <Loading />
            }

            <ModalCadastroContato
                isOpen={isModalCadastroContatoOpen}
                handleClose={handleCloseModalCadastroContato}
                contato={contatoSelecionado}
                carregaContatos={carregaContatos}
            />

            <Modal open={confirmacaoDeletar} setOpen={setConfirmacaoDeletar}>
                <Modal.Titulo texto={`Deletar`} />
                <Modal.Descricao texto={`Deseja realmente deletar o modelo "${contatoSelecionado?.nome}"?`} />
                <Modal.ContainerBotoes>
                    <Modal.BotaoAcao textoBotao="Deletar" acao={confirmDeleteContato} />
                    <Modal.BotaoCancelar acao={() => setContatoSelecionado(null)} />
                </Modal.ContainerBotoes>
            </Modal>
        </>
    );
};
