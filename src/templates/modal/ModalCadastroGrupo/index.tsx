import { Contato } from '../../../types/contato.d';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import ModalBase from '../../../components/ModalBase';
import Botao from '../../../components/Button';

interface ModalCriarGrupoProps {
    isOpen: boolean;
    handleClose: () => void;
    contatos: Contato[];
    nomeGrupo: string;
    setNomeGrupo: (nome: string) => void;
}

const ModalCriarGrupo = ({ isOpen, handleClose, contatos, nomeGrupo, setNomeGrupo }: ModalCriarGrupoProps) => {

    const [filtroNome, setFiltroNome] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const pageCount = Math.ceil(contatos.length / itemsPerPage);

    const adicionarContatoAoGrupo = (contato: Contato) => {
        setMembrosSelecionados([...membrosSelecionados, contato]);
    };

    const removerContatoDoGrupo = (contato: Contato) => {
        setMembrosSelecionados(membrosSelecionados.filter((membro) => membro.id !== contato.id));
    };

    const handlePageClick = (event: any) => {
        setCurrentPage(event.selected);
    };

    const contatosPagina = contatos.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

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

                <div className="overflow-x-auto">
                    <table className="min-w-full  table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-gray-700">Nome</th>
                                <th className="px-4 py-2 text-left text-gray-700">Número</th>
                                <th className="px-4 py-2 text-left text-gray-700">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contatosPagina.map((contato) => {
                                const jaSelecionado = membrosSelecionados.some((membro) => membro.id === contato.id);
                                return (
                                    <tr key={contato.id} className="border-t">
                                        <td className="px-4 py-2">{contato.id}</td>
                                        <td className="px-4 py-2">{contato.nome}</td>
                                        <td className="px-4 py-2">{contato.numero}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => {
                                                    if (jaSelecionado) {
                                                        removerContatoDoGrupo(contato);
                                                    } else {
                                                        adicionarContatoAoGrupo(contato);
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-md transition-colors ${jaSelecionado
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                            >
                                                {jaSelecionado ? 'Remover' : 'Adicionar'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <ReactPaginate
                        previousLabel="Anterior"
                        nextLabel="Próxima"
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName="flex justify-center gap-2 items-center"
                        pageClassName="px-3 py-2 border rounded-md cursor-pointer"
                        activeClassName="bg-green-500 text-white"
                        previousClassName="px-3 py-2 border rounded-md cursor-pointer"
                        nextClassName="px-3 py-2 border rounded-md cursor-pointer"
                    />
                </div>
            </div>
        </ModalBase>
    );
};

export default ModalCriarGrupo;
