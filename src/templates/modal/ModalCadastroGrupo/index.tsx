import { Contato } from '../../../types/contato.d';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import ModalBase from '../../../components/ModalBase';
import Botao from '../../../components/Button';
import useDebounce from '../../../hooks/useDebounce';
import { getListContatos } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';

interface ModalCriarGrupoProps {
    isOpen: boolean;
    handleClose: () => void;
    nomeGrupo: string;
    setNomeGrupo: (nome: string) => void;
}

const ModalCriarGrupo = ({ isOpen, handleClose, nomeGrupo, setNomeGrupo }: ModalCriarGrupoProps) => {
    const [contatos, setListaContato] = useState<Array<Contato>>([]);
    const [filtroNome, setFiltroNome] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const toast = useToastLoading();
    const [pageCount, setPageCount] = useState<number>(1);
    const [contatosPagina, setContatosPagina] = useState<Contato[]>();

    const adicionarContatoAoGrupo = (contato: Contato) => {
        setMembrosSelecionados([...membrosSelecionados, contato]);
    };

    const removerContatoDoGrupo = (contato: Contato) => {
        setMembrosSelecionados(membrosSelecionados.filter((membro) => membro.id !== contato.id));
    };

    const handlePageClick = (event: any) => {
        setCurrentPage(event.selected);
    };


    const [membrosSelecionados, setMembrosSelecionados] = useState<Contato[]>([]);

    const criarGrupo = () => {
        if (!nomeGrupo.trim()) {
            alert('Por favor, insira um nome para o grupo!');
            return;
        }

        if (membrosSelecionados.length === 0) {
            alert('Adicione pelo menos um contato ao grupo.');
            return;
        }
        const novoGrupo = { nome: nomeGrupo, membros: membrosSelecionados };
        console.log('Grupo Criado:', novoGrupo);

        handleClose();
        setNomeGrupo('');
        setMembrosSelecionados([]);
    };

    const carregaContatos = async (): Promise<void> => {
        const request = () => getListContatos();
        const response = await request();
        if (response.sucesso) setListaContato(response.dados);

        else toast({ tipo: response.tipo, mensagem: response.mensagem });
    };

    const filtroDebounce = useDebounce(carregaContatos, 500);

    useEffect(() => {
        filtroDebounce();
    }, [])

    useEffect(() => {
        const contatosFiltrados = contatos.filter((contato) =>
            contato.nome.toLowerCase().includes(filtroNome.toLowerCase())
        );
        setPageCount(Math.ceil(contatosFiltrados.length / itemsPerPage));
        setContatosPagina(
            contatosFiltrados.slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
            )
        );
    }, [contatos, currentPage, filtroNome, itemsPerPage]);

    return (
        <ModalBase
            isOpen={isOpen}
            title="Cadastrar Grupo"
            handleClose={handleClose}
            footer={
                <>
                    <Botao tipo="padrao" onClick={handleClose} texto="Cancelar" />
                    <Botao tipo="sucesso" onClick={criarGrupo} texto="Salvar" />
                </>
            }
        >
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Nome do grupo"
                    value={nomeGrupo}
                    onChange={(e) => setNomeGrupo(e.target.value)}
                    className="w-full p-3 border rounded-md mb-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Selecione os Contatos</h3>
                <input
                    type="text"
                    placeholder="Pesquisar por nome"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    className="w-full p-3 border rounded-md mb-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <div className="overflow-x-auto shadow-md w-[600px]">
                    <table className="min-w-full bg-gray-50">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm text-gray-600">ID</th>
                                <th className="px-4 py-2 text-left text-sm text-gray-600">Nome</th>
                                <th className="px-4 py-2 text-left text-sm text-gray-600">Número</th>
                                <th className="px-4 py-2 text-center text-sm text-gray-600">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contatosPagina?.map((contato, index) => {
                                const jaSelecionado = membrosSelecionados.some(
                                    (membro) => membro.id === contato.id
                                );
                                return (
                                    <tr
                                        key={contato.id}
                                        className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-700">{contato.id}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700">{contato.nome}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700">{contato.numero}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() =>
                                                    jaSelecionado
                                                        ? removerContatoDoGrupo(contato)
                                                        : adicionarContatoAoGrupo(contato)
                                                }
                                                className={`px-2 py-1 text-xs rounded transition-colors ${jaSelecionado
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-green-500 text-white hover:bg-green-600"
                                                    }`}
                                            >
                                                {jaSelecionado ? "Remover" : "Adicionar"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <ReactPaginate
                        previousLabel="←"
                        nextLabel="→"
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName="flex items-center gap-1"
                        pageClassName="px-2 py-1 border rounded text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                        activeClassName="bg-green-500 text-white rounded"
                        previousClassName="px-2 py-1 border rounded text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                        nextClassName="px-2 py-1 border rounded text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                    />
                </div>
            </div>
        </ModalBase>
    );
};

export default ModalCriarGrupo;
